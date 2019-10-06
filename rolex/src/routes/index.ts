import { Router, Request, Response} from "express";
import auth from './auth';
import stats from './stats';
import submit from './submit';
import info from './info';

const routes = Router();

routes.use("/auth", auth);
routes.use("/stats", stats);
routes.use("/submit", submit);
routes.use("/info", info);

export default routes;