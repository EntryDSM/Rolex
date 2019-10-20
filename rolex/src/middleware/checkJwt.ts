import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config";
import { redisClient } from "../utils/redisWrapper";
import Err from "./errorHandlers";
import { AdminType } from "../entity/Admin";

export const checkRefresh = async (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.get("X-Refresh-Token");
    let jwtPayload;
    try {
        jwtPayload = jwt.verify(token, jwtSecret);
        if(await redisClient.get(`rolex:token_${jwtPayload.admin_id}`)) {
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

export const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.get('Authorization');
    let jwtPayload;
    try {
        jwtPayload = jwt.verify(token, jwtSecret);
        if(jwtPayload) next();
    } catch (e) {
        e.status = 401;
        e.code = 1202;
        next(e);
    }
}

export const checkRoot = async (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.get('Authorization');
    let jwtPayload;
    try {
        jwtPayload = jwt.verify(token, jwtSecret);
        console.log(jwtPayload.adminType);
        if(jwtPayload.adminType === AdminType.ROOT) {
            next();
        } else {
            throw new Err('Access denied. please access with root account.')
        }
    } catch (e) {
        e.status = 401;
        e.code = 1203;
        next(e);
    }
}