import { Request, Response, NextFunction } from "express";
import { getConnectionManager, getRepository } from "typeorm";
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

    static getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let dmc = 0, dsc = 0, dcc = 0, nmc = 0, nsc = 0, ncc = 0;
            dmc = await StatsController.find(true, "MEISTER");
            dsc = await StatsController.find(true, "SOCIAL");
            dcc = await StatsController.find(true, "COMMON");
            nmc = await StatsController.find(false, "MEISTER");
            nsc = await StatsController.find(false, "SOCIAL");
            ncc = await StatsController.find(false, "COMMON");

            res.json({
                daejeon: {
                    meister: dmc,
                    social: dsc,
                    common: dcc
                },
                nation: {
                    meister: nmc,
                    social: nsc,
                    common: ncc
                },
                total: {
                    daejeon: dmc+dsc+dcc,
                    nation: nmc+nsc+ncc
                }
            })
        } catch (e) {
            next(e);
        }
    }

    static find = async (is_daejeon:boolean, type:string) => {
        const manager = getConnectionManager().get('avengers');
            
        const gedRepository = manager.getRepository(Ged_application);
        const graduatedRepository = manager.getRepository(Graduated_application);
        const ungraduatedRepository = manager.getRepository(Ungraduated_application);
        
        let data = {ged:null, gred:null, ungred:null};
        data.ged = await gedRepository.find({
            where: {is_daejeon:is_daejeon, apply_type: type}
        });
        data.gred = await graduatedRepository.find({
            where: {is_daejeon:is_daejeon, apply_type: type}
        });
        data.ungred = await ungraduatedRepository.find({
            where: {is_daejeon:is_daejeon, apply_type: type}
        })
        return data.ged.length+data.gred.length+data.ungred.length;
    }

    static getCompetition = async (req: Request, res: Response, next: NextFunction) => {
       try {
            let dmc = 0, dsc = 0, dcc = 0, nmc = 0, nsc = 0, ncc = 0;
            dmc = await StatsController.find(true, "MEISTER");
            dsc = await StatsController.find(true, "SOCIAL");
            dcc = await StatsController.find(true, "COMMON");
            nmc = await StatsController.find(false, "MEISTER");
            nsc = await StatsController.find(false, "SOCIAL");
            ncc = await StatsController.find(false, "COMMON");
            
            res.json({
                daejeon: {
                    meister: `${(dmc/12).toFixed(1)}:1`,
                    social: `${(dsc/2).toFixed(1)}:1`,
                    common: `${(dcc/18).toFixed(1)}:1`
                },
                nation: {
                    meister: `${(nmc/16).toFixed(1)}:1`,
                    social: `${(nsc/2).toFixed(1)}:1`,
                    common: `${(ncc/30).toFixed(1)}:1`
                },
                total: {
                    daejeon: `${((dmc+dsc+dcc)/32).toFixed(1)}:1`,
                    nation: `${((nmc+nsc+ncc)/48).toFixed(1)}:1`,
                    all: `${((dmc+dsc+dcc+nmc+nsc+ncc)/80).toFixed(1)}:1`
                }
            })
        } catch(e) {
            next(e);
        }
    }
}

export default StatsController;