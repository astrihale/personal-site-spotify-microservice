import express, {Express, Request, Response} from 'express';
import {name} from '../package.json';
import dotenv from 'dotenv';
import pino from 'pino';

// Load environment variables from .env file.
dotenv.config();
const PORT: Number = Number(process.env.PORT) || 7689;

// Create the main application
const application: Express = express();
const logger = pino();

// Add the default echo route
application.get('/', async (req: Request, res: Response) => {
    res.status(200).send({message: `Hello from '${name}'!`});
});

// Start the application
application.listen(PORT, () => {
    logger.info(`Started server on port: ${PORT}.`);
});
