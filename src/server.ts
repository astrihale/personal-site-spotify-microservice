import express, {Express, Request, Response} from 'express';
import {config as ConfigEnvironment} from 'dotenv';

// Load environment variables from development.env file.
ConfigEnvironment();

const application: Express = express();
const PORT: Number = Number(process.env.PORT) || 7689;

application.get('/', async (req: Request, res: Response) => {
    res.status(200).send('Hello from spotify-microservice!');
});

application.listen(PORT, () => {
    console.log(`Started server on port: ${PORT}.`);
});
