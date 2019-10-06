import { Router, Request, Response} from "express";
import auth from './auth';
import stats from './stats';

const routes = Router();

routes.use("/auth", auth);
routes.use("/stats", stats);

export default routes;