import { Request, Response, NextFunction } from "express";
import { getConnectionManager } from "typeorm";
import { User } from "../entity/User";
import { Ged_application } from "../entity/Ged";
import { Graduated_application } from "../entity/Graduated";
import { Ungraduated_application } from "../entity/Ungraduated";

class ListController {
    static getApplicants = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let is_daejeon:boolean;
            const { region, type, status } = req.query;
            let find = [0, 0], userList=[], resultList=[];
            if(region === 'daejeon') {
                is_daejeon = true;
                find[0] = 1;
            } else if(region === 'nation') {
                is_daejeon = false;
                find[0] = 1;
            }
            if(type) find[1] = 1;

            userList = await ListController.find(is_daejeon, type , find);
            const manager = getConnectionManager().get('avengers');
            const userRepository = manager.getRepository(User);

            let option, select;
            if(userList.length) {
                await userList.forEach(async (user, index)=>{
                    option = {};
                    option.email = user["user_email"];
                    if(status==="0") option["is_paid"] = false;
                    if(status==="1") option["is_printed_application_arrived"] = false;
                    select = await userRepository.findOne({
                        where: option,
                        select: ["email", "exam_code", "is_printed_application_arrived", "is_final_submit", "is_paid"]
                    })
                    if(select) {
                        select.name = user.name;
                        if(user.is_daejeon) select.region = 'daejeon';
                        else select.region = 'nation';
                        select.type = user.apply_type;
                        resultList.push(select);
                    }
                    if(index == userList.length-1) res.status(200).json(resultList);
                });
            } else {
                res.status(200).json([]);
            }
        } catch(e) {
            next(e);
        }
    }

    static find = async (is_daejeon?:boolean, type?:string, flag?:Array<number>) => {
        const manager = getConnectionManager().get('avengers');

        const gedRepository = manager.getRepository(Ged_application);
        const graduatedRepository = manager.getRepository(Graduated_application);
        const ungraduatedRepository = manager.getRepository(Ungraduated_application);
        
        let ged, gred, ungred;
        let result = [];
        let where = {};
        
        if(flag[0] === 1) {
            where["is_daejeon"] = is_daejeon;
        } 
        if(flag[1] === 1) {
            where["apply_type"] = type;
        }
        ged = await gedRepository.find({
            select: ["user_email", "name", "is_daejeon", "apply_type"],
            where: where
        });
        gred = await graduatedRepository.find({
            select: ["user_email", "name", "is_daejeon", "apply_type"],
            where: where
        });
        ungred = await ungraduatedRepository.find({
            select: ["user_email", "name", "is_daejeon", "apply_type"],
            where: where
        })
        result = ged.concat(gred, ungred);
        return result;
    }
}

export default ListController;