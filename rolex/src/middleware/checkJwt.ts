import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config";
import { redisClient } from "../utils/redisWrapper";
import Err from "./errorHandlers";

export const checkRefresh = async (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.get("X-Refresh-Token");
    let jwtPayload;
    try {
        jwtPayload = jwt.verify(token, jwtSecret);
        if(await redisClient.get(`rolex_${jwtPayload.admin_id}`)) {
            res.locals.jwtPayload = jwtPayload;
            next();
        } else {
            throw new Err('Please login again.');
        }
    } catch(e) {
        e.status = 401;
        e.code = 1202;
        next(e);
    }
}