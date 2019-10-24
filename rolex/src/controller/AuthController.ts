import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { getConnectionManager } from "typeorm";
import { validate } from "class-validator";
import { Admin, AdminType } from "../entity/Admin"
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
                    { adminId: admin.admin_id, adminType: admin.admin_type },
                    jwtSecret,
                    { expiresIn: "60m" }
                );
                const RefreshToken = jwt.sign(
                    { adminId: admin.admin_id, adminType: admin.admin_type },
                    jwtSecret,
                    { expiresIn: "12h" }
                );
                
                await redisClient.set(`rolex:token_${id}`, RefreshToken, 'EX', 60*60*12);
                
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
        const { admin_id, admin_type } = res.locals.jwtPayload;
        const newToken = jwt.sign(
            { adminId: admin_id, adminType: admin_type },
            jwtSecret,
            { expiresIn: "60m" });
        res.status(201).json({access: newToken});
    }

    static newUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id, password, email, type, name } = req.body;

            if(!id || !password || !email || !name) {
                throw new Err('user data must be provided');
            } else {
                const manager = getConnectionManager().get('rolex');
                const adminRepository = manager.getRepository(Admin);
                if(await adminRepository.findOne({where: {admin_id: id}})) {
                    throw new Err('user already exists');
                } else {
                    let admin_type: AdminType;
                    if(type === "root") {
                        admin_type = AdminType.ROOT;
                    } else {
                        admin_type = AdminType.ADMINISTRATION;
                    }
                    let user = new Admin();
                    user.admin_name = name;
                    user.admin_type = admin_type;
                    user.admin_id = id;
                    user.admin_email = email;
                    user.admin_password = password;
                    user.hashPassword();
                    await adminRepository.save(user);
                    res.send('sign up success');
                }
            }  
        } catch(e) {
            e.code = 1301;
            next(e);
        }
    }
}

export default AuthController;