import {Request, Response, Router} from "express";
import {name} from '../../package.json';

const echoRouter = Router();

// Add the default echo route
echoRouter.get('/echo', async (req: Request, res: Response) => {
    /*
        #swagger.tags = ['Echo']
     */

    res.status(200).send({message: `Hello from '${name}'!`});
});

export = echoRouter;
