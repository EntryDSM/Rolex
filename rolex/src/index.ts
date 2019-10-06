import "reflect-metadata";
import { createConnections, getConnection } from "typeorm";
import * as express from "express";
import * as cors from "cors";
import * as helmet from "helmet";
import * as dotenv from "dotenv";
dotenv.config();
import { port } from "./config/config";
import routes from './routes';
import Err from './middleware/errorHandlers';

createConnections()
    .then(async connections => {
    const app = express();
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    app.use("/", routes);

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