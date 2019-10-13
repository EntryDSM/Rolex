import { Request, Response, NextFunction } from "express";
import { getConnectionManager } from "typeorm";
import { Ged_application } from "../entity/Ged";
import { Graduated_application } from "../entity/Graduated";
import { Ungraduated_application } from "../entity/Ungraduated";
import { User } from "../entity/User";
import fs from "fs";
import Err from "../middleware/errorHandlers";
import { dirname } from "path";

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
                let user:User = await userRepository.findOne({
                    where: {email: ungred[0].user_email},
                    select: ["conversion_score"],
                })
                if(user) {
                    res.status(200).json({application:ungred[0], score:user.conversion_score});
                } else {
                    res.status(200).json({application:ungred[0], score:null});
                }
            } else {
                let ged = await gedRepository.find({
                    where: {user_email: email}
                });
                if(ged.length) {
                    let user = await userRepository.findOne({
                        where: {email: ged[0].user_email},
                        select: ["conversion_score"],
                    })
                    if(user) {
                        res.status(200).json({application:ged[0], score:user.conversion_score});
                    } else {
                        res.status(200).json({application:ged[0], score:null});
                    }
                } else {
                    let gred = await graduatedRepository.find({
                        where: {user_email: email}
                    })
                    if(gred.length) {
                        let user = await userRepository.findOne({
                            where: {email: gred[0].user_email},
                            select: ["conversion_score"],
                        })
                        if(user) {
                            res.status(200).json({application:gred[0], score:user.conversion_score});
                        } else {
                            res.status(200).json({application:gred[0], score:null});
                        }
                    } else {
                        res.status(200).json({email:email});
                    }
                }
            }
        } catch (e) {
            next(e);
        }
    }

    static changeStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, status } = req.query;
            
            const manager = getConnectionManager().get('avengers');
            const userRepository = manager.getRepository(User);
            if(status === "0") {
                let user = await userRepository.findOne({
                    where: {email: email}
                })
                user.is_paid = !user.is_paid;
                await userRepository.save(user);
                res.status(201).json("status change success");
            } else if(status === "1") {
                let user = await userRepository.findOne({
                    where: {email: email}
                })
                user.is_printed_application_arrived = !user.is_printed_application_arrived;
                await userRepository.save(user);
                res.status(201).json("status change success");
            }
        } catch (e) {
            next(e);
        }
    }

    static getPhoto = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let filename = req.query.email;
            
            fs.readFile('images/'+filename, (err, data)=>{
                if(err) {
                    let err = new Err('not found photo');
                    next(err)
                } else {
                    res.writeHead(200, {"Content-Type": "image/*"});
                    res.write(data);
                    res.end();
                }
            })
        } catch (e) {
            next(e);
        }
    }
}

export default InfoController;