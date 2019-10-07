import { Request, Response, NextFunction } from "express";
import { getConnectionManager } from "typeorm";
import { Ged_application } from "../entity/Ged";
import { Graduated_application } from "../entity/Graduated";
import { Ungraduated_application } from "../entity/Ungraduated";
import { User } from "../entity/User";
import Err from "../middleware/errorHandlers";

class InfoController {
    static getApplication = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const manager = getConnectionManager().get('avengers');
            
            const gedRepository = manager.getRepository(Ged_application);
            const graduatedRepository = manager.getRepository(Graduated_application);
            const ungraduatedRepository = manager.getRepository(Ungraduated_application);
            const userRepository = manager.getRepository(User);
            
            const email = req.query.email;
            let ungred = await ungraduatedRepository.find({
                where: {user_email: email}
            });
            if(ungred.length) {
                let user = await userRepository.findOne({
                    where: {email: ungred[0].user_email},
                    select: ["final_score"],
                })
                res.status(200).json({application:ungred[0], score:user});
            } else {
                let ged = await gedRepository.find({
                    where: {user_email: email}
                });
                if(ged.length) {
                    let user = await userRepository.findOne({
                        where: {email: ged[0].user_email},
                        select: ["final_score"],
                    })
                    res.status(200).json({application:ged[0], score:user});
                } else {
                    let gred = await graduatedRepository.find({
                        where: {user_email: email}
                    })
                    if(gred.length) {
                        let user = await userRepository.findOne({
                            where: {email: gred[0].user_email},
                            select: ["final_score"],
                        })
                        res.status(200).json({application:gred[0], user});
                    } else {
                        res.status(200).json({email:email, submit:false});
                    }
                }
            }
        } catch (e) {
            next(e);
        }
    }

    // static changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    //     try {

    //     } catch (e) {
    //         next(e);
    //     }
    // }
}

export default InfoController;