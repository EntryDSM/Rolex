import { Request, Response, NextFunction } from "express";
import { getConnectionManager } from "typeorm";
import { Ged_application } from "../entity/Ged";
import { Graduated_application } from "../entity/Graduated";
import { Ungraduated_application } from "../entity/Ungraduated";

class StatsController {
    static getApplicants = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const manager = getConnectionManager().get('avengers');
            
            const gedRepository = manager.getRepository(Ged_application);
            const graduatedRepository = manager.getRepository(Graduated_application);
            const ungraduatedRepository = manager.getRepository(Ungraduated_application);
            
            let region: boolean;
            if(req.query.region == 'daejeon') {
                region = true;
            } else {
                region = false;
            }
            let ungred = await ungraduatedRepository.find({
                select: ["user_email"],
                where: {is_daejeon: region}
            });
            let ged = await gedRepository.find({
                select: ["user_email"],
                where: {is_daejeon: region}
            });
            let gred = await graduatedRepository.find({
                select: ["user_email"],
                where: {is_daejeon: region}
            })
            res.json({applicants: ungred.length+ged.length+gred.length});
        } catch(e) {
            next(e);
        }
    }
}

export default StatsController;