import { Request, Response, NextFunction } from "express";
import { getConnectionManager } from "typeorm";
import { Ged_application } from "../entity/Ged";
import { Graduated_application } from "../entity/Graduated";
import { Ungraduated_application } from "../entity/Ungraduated";
import Err from "../middleware/errorHandlers";

class InfoController {
    static getApplication = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const manager = getConnectionManager().get('avengers');
            
            const gedRepository = manager.getRepository(Ged_application);
            const graduatedRepository = manager.getRepository(Graduated_application);
            const ungraduatedRepository = manager.getRepository(Ungraduated_application);
            
            const email = req.query.email;
            let ungred = await ungraduatedRepository.find({
                where: {user_email: email}
            });
            if(ungred.length) {
                res.status(200).json(ungred[0]);
            } else {
                let ged = await gedRepository.find({
                    where: {user_email: email}
                });
                if(ged.length) {
                    res.status(200).json(ged[0]);
                } else {
                    let gred = await graduatedRepository.find({
                        where: {user_email: email}
                    })
                    if(gred.length) {
                        res.status(200).json(gred[0]);
                    } else {
                        throw new Err('Not Found application');
                    }
                }
            }
        } catch (e) {
            next(e);
        }
    }
}

export default InfoController;