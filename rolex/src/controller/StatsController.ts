import { Request, Response, NextFunction } from "express";
import { getConnectionManager, Between, LessThanOrEqual, Like, MoreThan } from "typeorm";
import { Ged_application } from "../entity/Ged";
import { Graduated_application } from "../entity/Graduated";
import { Ungraduated_application } from "../entity/Ungraduated";
import { User } from "../entity/User";

class StatsController {
    static getApplicants = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const manager = getConnectionManager().get('avengers');
            
            const gedRepository = manager.getRepository(Ged_application);
            const graduatedRepository = manager.getRepository(Graduated_application);
            const ungraduatedRepository = manager.getRepository(Ungraduated_application);
            const userRepository = manager.getRepository(User);

            let whereOption: object;
            if(req.query.region === 'daejeon') {
                whereOption = { is_daejeon : true };
            } else if(req.query.region === 'nation') {
                whereOption = { is_daejeon : false };
            } else {
                whereOption = null;
            }
            let ungred = await ungraduatedRepository.find({
                select: ["user_email"],
                where: whereOption
            });
            let ged;
            ged = await gedRepository.find({
                select: ["user_email"],
                where: whereOption
            });
            let gred = await graduatedRepository.find({
                select: ["user_email"],
                where: whereOption
            })
            let data;
            data = ged.concat(ungred, gred);
            let option = [];
            for(let i=0; i<data.length; i++) {
                option.push({email: data[i].user_email, is_final_submit: true});    
            }
            let user = [];
            if(option.length) {
                user = await userRepository.find({
                    where: option
                });
            }
            res.json({applicants: user.length});
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
        const userRepository = manager.getRepository(User);

        let data;
        let ged;
        let typeOption = {};
        typeOption["is_daejeon"] = is_daejeon;
        if(type === "SOCIAL") {
            typeOption["apply_type"] = Like("social%");
        } else {
            typeOption["apply_type"] = type;
        }

        ged = await gedRepository.find({
            where: typeOption,
            select: ["user_email"]
        });
        let gred = await graduatedRepository.find({
            where: typeOption,
            select: ["user_email"]
        });
        let ungred = await ungraduatedRepository.find({
            where: typeOption,
            select: ["user_email"]
        })
        data = ged.concat(ungred, gred);
        let option = [];
        for(let i=0; i<data.length; i++) {
            option.push({email: data[i].user_email, is_final_submit: true});    
        }
        let user = []
        if(option.length) {
            user = await userRepository.find({
                where: option
            });
        }
        return user.length;
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

    static getUserList = async (is_daejeon:boolean, apply_type:string) => {
        const manager = getConnectionManager().get('avengers');
            
        const gedRepository = manager.getRepository(Ged_application);
        const graduatedRepository = manager.getRepository(Graduated_application);
        const ungraduatedRepository = manager.getRepository(Ungraduated_application);
         
        let result = [];

        let applyOption = {}
        if(apply_type === "social") {
            applyOption["apply_type"] = Like("social%");
        } else {
            applyOption["apply_type"] = apply_type;
        }
        applyOption["is_daejeon"] = is_daejeon;
        let ged;
        ged = await gedRepository.find({
            select: ["user_email"],
            where: applyOption,
        });
        let gred = await graduatedRepository.find({
            select: ["user_email"],
            where: applyOption,
        });
        let ungred = await ungraduatedRepository.find({
            select: ["user_email"],
            where: applyOption,
        });
        result = ged.concat(gred, ungred);
        return result;
    }

    static countingUser = async (region:boolean, type:string, result:object) => {
        const manager = getConnectionManager().get('avengers');
        const userRepository = manager.getRepository(User);

        let users = await StatsController.getUserList(region, type);
        for(let score=150; score>60; score-=10) {
            if(users.length) {
                    let option = [];
                if(score > 70) {
                    for(let k=0; k<users.length; k++) {
                        option.push({is_final_submit: true, email: users[k].user_email ,conversion_score: Between(score-10+Number.MIN_VALUE, score)})
                    }
                } else {
                    for(let k=0; k<users.length; k++) {
                        option.push({is_final_submit: true, email: users[k].user_email ,conversion_score: LessThanOrEqual(score)})
                    }
                }
                let user = await userRepository.find({where: option});
                result[score] = user.length;
            } else {
                result[score] = users.length;
            }
        }
    }

    static getScore = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { type, region } = req.query;

            let score = {};
            let is_daejeon:boolean;
            
            if(region==="daejeon") is_daejeon = true;
            else is_daejeon = false;
            
            await StatsController.countingUser(is_daejeon, type, score);
            res.json(score);
        } catch (e) {
            next(e);
        }
    }
}

export default StatsController;