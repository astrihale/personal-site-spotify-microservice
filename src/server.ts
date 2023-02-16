import express, {Express, NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import pino from 'pino';

import {serve as SwaggerServe, setup as SwaggerSetup} from "swagger-ui-express";

// Load environment variables from .env file.
dotenv.config();
const PORT: Number = Number(process.env.PORT) || 7689;

// Create the main application
const application: Express = express();
const logger = pino();

// Add the echo router
import echoRouter from "./routes/echo";

application.use(async (req: Request, res: Response, next: NextFunction) => {
    next();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode}`);
});
application.use('/', echoRouter);

// Add the swagger endpoint
import {generateOpenApi} from "./swagger";

setTimeout(async () => {
    application.use('/api-docs', SwaggerServe, SwaggerSetup(require(await generateOpenApi())));
    application.get('/', async (_: Request, res: Response) => res.status(200).send({message: 'Hello!'}));

    // Start the application
    application.listen(PORT, () => {
        logger.info(`Started server on port: ${PORT}.`);
    });
});
