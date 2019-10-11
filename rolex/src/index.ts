import "reflect-metadata";
import { createConnections, getConnection } from "typeorm";
import express from "express";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";
dotenv.config();
import { port } from "./config/config";
import routes from './routes';
import Err from './middleware/errorHandlers';

createConnections()
    .then(async connections => {
    !fs.existsSync('images') && fs.mkdirSync('images');
    const app = express();
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use("/api", routes);

    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const err = new Err('Not Found');
        err.status = 404;
        err.code = 404;
        next(err);
    })

    app.use((err: Err, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(err.status || 500).json({
            description: err.message || 'unknown internal server error',
            error_code: err.code || 9999
        })
    })

    app.listen(port, ()=>{
        console.log(`Server Started on ${port} port.`);
    });
})
.catch(error => console.log(error));