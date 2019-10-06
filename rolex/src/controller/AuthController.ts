import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository, getConnectionManager } from "typeorm";
import { validate } from "class-validator";
import { Admin } from "../entity/Admin"
import { jwtSecret } from '../config/config';
import { redisClient } from '../utils/redisWrapper';
import Err from "../middleware/errorHandlers";

class AuthController {
    static login = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            let { id, password } = req.body;
            if(!(id && password)) {
                throw new Err('invalid login info');
            }   
    
            const manager = getConnectionManager().get('rolex');
            const adminRepository = manager.getRepository(Admin);
            let admin: Admin;

            admin = await adminRepository.findOneOrFail({where: {admin_id: id}});
            if(!admin) throw new Err('invalid login info');

            if (!admin.checkPassword(password)) {
                throw new Err('invalid login info');
            } else {
                const AcessToken = jwt.sign(
                    { adminId: admin.admin_id },
                    jwtSecret,
                    { expiresIn: "60m" }
                );
                const RefreshToken = jwt.sign(
                    { adminId: admin.admin_id, adminType: admin.admin_type },
                    jwtSecret,
                    { expiresIn: "12h" }
                );
                
                await redisClient.set(`rolex_${id}`, RefreshToken, 'EX', 60*60*12);
                
                res.json({
                    access: AcessToken,
                    refresh: RefreshToken,
                });
            }   
        } catch (e) {
            e.status = 403;
            e.code = 1200
            next(e);
        }
    }

    static refresh = async (req: Request, res: Response) => {
        const { admin_id } = res.locals.jwtPayload;
        const newToken = jwt.sign(
            { adminId: admin_id },
            jwtSecret,
            { expiresIn: "60m" });
        res.status(201).json({access: newToken});
    }
}

export default AuthController;