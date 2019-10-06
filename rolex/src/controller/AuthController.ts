import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository, getConnectionManager } from "typeorm";
import { validate } from "class-validator";
import { Admin } from "../entity/Admin"
import { jwtSecret } from '../config/config';
import { redisClient } from '../utils/redisWrapper';

class AuthController {
    static login = async (req: Request, res: Response)=>{
        let { id, password } = req.body;
        if(!(id && password)) {
            res.status(400).send("Invalid Request Format");
        }   

        const manager = getConnectionManager().get('rolex');
        const adminRepository = manager.getRepository(Admin);
        let admin: Admin;
        try {
            admin = await adminRepository.findOneOrFail({where: {admin_id: id}});
        } catch (error) {
            res.status(401).send("Invalid Id or Password");
        }

        if (!admin.checkPassword(password)) {
            res.status(401).send("Invalid Id or Password");
            return;
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
            
            await redisClient.set(`rolex_${id}`, RefreshToken);
            
            res.json({
                access: AcessToken,
                refresh: RefreshToken,
            });
        }
    }
}

export default AuthController;