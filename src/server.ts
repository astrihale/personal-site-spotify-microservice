import express, {Express, NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import pino from 'pino';
import cors from 'cors';

import {serve as SwaggerServe, setup as SwaggerSetup} from "swagger-ui-express";

// Load environment variables from .env file.
dotenv.config();
const PORT: Number = Number(process.env.PORT) || 7689;

// Create the main application
const application: Express = express();
application.use(cors());
application.set('view engine', 'ejs');
const logger = pino({
    level: 'debug'
});

// Create the primitive request/response logger
application.use(async (req: Request, res: Response, next: NextFunction) => {
    next();
    logger.debug(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
});

// Add the echo router
import echoRouter from "./routes/echo";

application.use('/', echoRouter);

// Add the spotify router
import spotifyRouter from "./routes/spotify";

application.use('/', spotifyRouter);

// Add the swagger endpoint
import {generateOpenApi} from "./swagger";

setTimeout(async () => {
    application.use('/api-docs/', SwaggerServe, SwaggerSetup(require(await generateOpenApi())));
    application.get('/', async (req: Request, res: Response) => res.redirect(`${req.protocol}://${req.get('host')}${req.originalUrl}api-docs/`));

    application.use(async (req: Request, res: Response, next: NextFunction) => {
        res.status(404);
        if (req.accepts('html')) {
            res.render('404');
        } else if (req.accepts('json')) {
            res.send({
                message: `We're sorry, but we failed to find what you're looking for.`,
                code: `PAGE_NOT_FOUND`
            });
        } else {
            res.send('PAGE_NOT_FOUND');
        }
    });

    // Start the application
    application.listen(PORT, () => {
        logger.info(`Started server on port: ${PORT}.`);
    });
});
