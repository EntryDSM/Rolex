import { Request, Response, NextFunction } from "express";
import { getConnectionManager, Like } from "typeorm";
import * as Excel from "exceljs";
import { User } from "../entity/User";
import { Ged_application } from "../entity/Ged";
import { Graduated_application } from "../entity/Graduated";
import { Ungraduated_application } from "../entity/Ungraduated";

class ListController {
    static getApplicants = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let is_daejeon:boolean;
            const { region, type, status } = req.query;
            let find = [0, 0], userList=[];
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

            let option, select, resultList = [];
            if(userList.length) {
                let cnt = 1;
                userList.forEach(async (user, index)=>{
                    option = {};
                    option.email = user["user_email"];
                    if(status) {
                        let statusData = status.split('');
                        if(statusData[0]==="1") option["is_paid"] = false;
                        if(statusData[1]==="1") option["is_printed_application_arrived"] = false;
                        if(statusData[2]==="1") option["is_final_submit"] = false;   
                    }
                    select = await userRepository.findOne({
                        where: option,
                        select: ["email", "receipt_code", "is_printed_application_arrived", "is_final_submit", "is_paid", "exam_code"],
                    })
                    if(select) {
                        select.name = user.name;
                        if(user.is_daejeon) select.region = 'daejeon';
                        else select.region = 'nation';
                        
                        if(user.school_name) select.school_name = user.school_name;

                        select.applicant_tel = user.applicant_tel;
                        select.type = user.apply_type;
                        await resultList.push(select);
                        if(cnt === userList.length) {
                            resultList.sort(function(a,b) {
                                if (a.receipt_code > b.receipt_code)
                                    return 1;
                                if (a.receipt_code < b.receipt_code)
                                    return -1;
                                return 0;
                            })
                            res.status(200).json(resultList);
                        }
                        cnt++;
                    } else {
                        if(cnt === userList.length) {
                            resultList.sort(function(a,b) {
                                if (a.receipt_code > b.receipt_code)
                                    return 1;
                                if (a.receipt_code < b.receipt_code)
                                    return -1;
                                return 0;
                            })
                            res.status(200).json(resultList);
                        }
                        cnt++;
                    }
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
            if(type === "social") {
                where["apply_type"] = Like("social%");
            } else {
                where["apply_type"] = type;
            }
        }
        ged = await gedRepository.find({
            select: ["user_email", "name", "is_daejeon", "apply_type", "applicant_tel"],
            where: where
        });
        gred = await graduatedRepository.find({
            select: ["user_email", "name", "is_daejeon", "apply_type", "school_name", "applicant_tel"],
            where: where
        });
        ungred = await ungraduatedRepository.find({
            select: ["user_email", "name", "is_daejeon", "apply_type", "school_name", "applicant_tel"],
            where: where
        })
        result = ged.concat(gred, ungred);
        return result;
    }

    static makeExcel = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let flag:Array<number> = [1,1];

            const manager = getConnectionManager().get('avengers');
            const userRepository = manager.getRepository(User);
            let userList = await userRepository.find({
                where: {is_final_submit: true},
                order: {receipt_code: "ASC"}
            });          

            let options = {
                filename: './test.xlsx',
                useSharedStrings: true,
            };
            
            let workbook = new Excel.Workbook();
            let sheet = workbook.addWorksheet('Hue Williams');
            let columns: Array<object> = [
                { header: '구분_지역_수험번호', key: 'exam_code', width: 20 },
                { header: '구분_지역_세부_접수번호', key: 'receipt_code', width: 20 },
                { header: '전형유형', key: 'apply_type', width: 20 },
                { header: '지역', key: 'region', width: 20 },
                { header: '추가유형', key: 'additional_type', width: 20 },
                { header: '성명', key: 'name', width: 20 },
                { header: '생년월일', key: 'birth_day', width: 20 },
                { header: '주소', key: 'address', width: 50 },
                { header: '휴대폰 번호', key: 'phone', width: 20 },
                { header: '성별', key: 'gender', width: 20 },
                { header: '학력구분', key: 'background', width: 20 },
                { header: '졸업년도', key: 'graduated_year', width: 20 },
                { header: '출신학교', key: 'school', width: 20 },
                { header: '반', key: 'class', width: 20 },
                { header: '보호자 성명', key: 'parent_name', width: 20 },
                { header: '보호자 연락처', key: 'parent_tel', width: 20 }
            ];
            let columns2: Array<object> = [
                { header: '1학년', key: 'first', width: 20 },
                { header: '2학년', key: 'second', width: 20 },
                { header: '3학년', key: 'third', width: 20 },
                { header: '교과성적환산점수', key: 'conversion', width: 20 },
                { header: '봉사시간', key: 'volunteer_time', width: 20 },
                { header: '봉사점수', key: 'volunteer_score', width: 20 },
                { header: '결석', key: 'full_cut', width: 20 },
                { header: '지각', key: 'late', width: 20 },
                { header: '조퇴', key: 'early_leave', width: 20 },
                { header: '결과', key: 'period_cut', width: 20 },
                { header: '출석점수', key: 'attendance_score', width: 20 },
                { header: '1차전형 총점', key: 'final', width: 20 },
                { header: '자기소개서', key: 'self_introduction', width: 100 },
                { header: '학업계획서', key: 'study_plan', width: 100 },
            ]
            let subjects = [{korean: "국어"}, {social: "사회"}, {history: "역사"}, {math: "수학"}, {science: "과학"}, {tech_and_home: "기술가정"}, {english: "영어"}];
            let cnt = 0;
            for(let i=1; i<=6; i++) {
                for(let j=0; j<subjects.length; j++) {
                    let obj = new excelForm(`${Object.values(subjects[j])[0]}${i}`, `${Object.keys(subjects[j])[0]}${i}`, 10);
                    columns.push(obj);
                    cnt++;
                }
                if(cnt === 42) {
                    columns = columns.concat(columns2);
                    sheet.columns = columns;
                }
            }
            let users = await userRepository
                .createQueryBuilder("user")
                .select('user.email')
                .where("is_final_submit = true")
                .orderBy("receipt_code", "ASC")
                .getMany();
            let commonSortedUser = await ListController.arrayByRegion(users, "common");
            let commonUserList = await ListController.macro(commonSortedUser);
            let meisterSortedUser = await ListController.arrayByRegion(users, "meister");
            let meisterUserList = await ListController.macro(meisterSortedUser);
            let socialSortedUser = await ListController.arrayByRegion(users, "social");
            let socialUserList = await ListController.macro(socialSortedUser);
            await ListController.addData(userList, true, "common", sheet);
            await ListController.addData(commonUserList, false, "common", sheet);
            await ListController.addData(userList, true, "meister", sheet);
            await ListController.addData(meisterUserList, false, "meister", sheet);
            await ListController.addData(userList, true, "social", sheet);
            await ListController.addData(socialUserList, false, "social", sheet);
            let filename = './test.xlsx';

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename='+filename);
        
            await workbook.xlsx.write(res);
                
            res.end();
        } catch (e) {
            next(e);
        }
    }
    static macro = async (emailList) => {
        let result:Array<User> = [];
        const manager = getConnectionManager().get('avengers');
        const userRepository = manager.getRepository(User);

        for(let i=0; i<emailList.length; i++) {
            let data = await userRepository.findOne({email: emailList[i], is_final_submit:true});
            if(data)
                await result.push(data);
        }
        return result;
    }

    static arrayByRegion = async (users, type: string) => {
        const manager = getConnectionManager().get('avengers');

        const gedRepository = manager.getRepository(Ged_application);
        const graduatedRepository = manager.getRepository(Graduated_application);
        const ungredRepository = manager.getRepository(Ungraduated_application);

        const region = ["제주", "강원", "부산","울산","경남", "광주","전남", "대구","경북", "전북", "인천","경기","서울", "충남","충북","세종"];

        let result = [], ged = [], gred = [], ungred = [], data = [], apply_type = {};

        if(type === "social") {
            apply_type["apply_type"] = Like("social%");
        } else {
            apply_type["apply_type"] = type;
        }
        for(let i=0; i<region.length; i++) {
            ged = await gedRepository.find({where:{
                is_daejeon:false,
                apply_type: apply_type["apply_type"],
                users,
                address: Like(`${region[i]}%`)
            }, select: ["user_email"]});
            gred = await graduatedRepository.find({where:{
                is_daejeon:false,
                apply_type: apply_type["apply_type"],
                users,
                address: Like(`${region[i]}%`)
            }, select: ["user_email"]});
            ungred = await ungredRepository.find({where:{
                is_daejeon:false,
                apply_type: apply_type["apply_type"],
                users,
                address: Like(`${region[i]}%`)
            }, select: ["user_email"]});
            if(ged.length) {
                ged.forEach(async (one)=>{
                    await result.push(one.user_email)
                })
            }   
            if(gred.length) {
                gred.forEach(async (one)=>{
                    await result.push(one.user_email)
                })
            } 
            if(ungred.length) {
                ungred.forEach(async (one)=>{
                    await result.push(one.user_email)
                })
            }    
        }
        return result;
    }

    static addData = async (userList: Array<User>, is_daejeon: boolean, type: string, sheet: Excel.Worksheet) => {
        const manager = getConnectionManager().get('avengers');

        const gedRepository = manager.getRepository(Ged_application);
        const graduatedRepository = manager.getRepository(Graduated_application);
        const ungredRepository = manager.getRepository(Ungraduated_application);

        let ged, gred, ungred;

        if(userList.length) {
            let count = 1, flag:number = 0;
            
            for(let i=0; i<userList.length; i++) {    
                let userData:[any, string] = null;
                let user = userList[i];
                let apply_type: object = {};
                if(type === "social") {
                    apply_type["apply_type"] = Like("social%");
                } else {
                    apply_type["apply_type"] = type;
                }
                ged = await gedRepository.findOne(Object.assign({user_email: user.email, is_daejeon: is_daejeon},apply_type));
                if(ged) {
                    userData = [ged, "ged"];
                    flag = 1;
                } else {
                    gred = await graduatedRepository.findOne(Object.assign({user_email: user.email, is_daejeon: is_daejeon},apply_type));
                    if(gred) {
                        userData = [gred, "gred"];
                        flag = 1;
                    } else {
                        ungred = await ungredRepository.findOne(Object.assign({user_email: user.email, is_daejeon: is_daejeon},apply_type));
                        if(ungred) {
                            userData = [ungred, "ungred"];
                            flag = 1;
                        } else {
                            flag = 0;
                        }
                    }
                }
                
                if(flag === 1) {
                    let exam_code: string, region: string, apply_type: string, background: string, receipt_code: string, gender: string, graduated_year: string, additional_type:string;

                    if(type === "common") {
                        exam_code = "1";
                        receipt_code = "1";
                        apply_type = "일반전형";
                    } else if (type === "meister") {
                        exam_code = "2";
                        receipt_code = "2";
                        apply_type = "마이스터전형";
                    } else {
                        exam_code = "3";
                        receipt_code = "3";
                        apply_type = "사회통합전형";
                    }
            
                    if(is_daejeon === true) {
                        exam_code = exam_code + "1";
                        receipt_code = receipt_code + "1";
                        region = "대전";
                    } else {
                        exam_code = exam_code + "2";
                        receipt_code = receipt_code + "2";
                        region = "전국";
                    }
                    
                    if(String(count).length === 1) 
                        exam_code = exam_code + "00" + String(count);
                    else if(String(count).length === 2)
                        exam_code = exam_code + "0" + String(count);
                    else 
                        exam_code = exam_code + String(count); 

                    if(type === "social") {
                        if(userData[0].apply_type === "SOCIAL_BASIC_LIVING") {
                            receipt_code = receipt_code + "3";
                            additional_type = "기초생활수급권자";
                        } else if(userData[0].apply_type === "SOCIAL_ONE_PARENT") {
                            receipt_code = receipt_code + "4";
                            additional_type = "한부모가족보호대상자";
                        } else if(userData[0].apply_type === "SOCIAL_TEEN_HOUSEHOLDER") {
                            receipt_code = receipt_code + "5";
                            additional_type = "소년소녀가장";
                        } else if(userData[0].apply_type === "SOCIAL_LOWEST_INCOME") {
                            receipt_code = receipt_code + "6";
                            additional_type = "차상위계층";
                        } else if(userData[0].apply_type === "SOCIAL_FROM_NORTH") {
                            receipt_code = receipt_code + "7";
                            additional_type = "북한이탈주민";
                        } else if(userData[0].apply_type === "SOCIAL_MULTICULTURAL") {
                            receipt_code = receipt_code + "8";
                            additional_type = "다문화가정";
                        }
                    } else {
                        if(userData[0].additional_type === "NOT_APPLICABLE") {
                            receipt_code = receipt_code + "0";
                            additional_type = "일반";
                        } else if(userData[0].additional_type === "PRIVILEGED_ADMISSION") {
                            receipt_code = receipt_code + "1";
                            additional_type = "특례입학대상자";
                        } else if(userData[0].additional_type === "NATIONAL_MERIT") {
                            receipt_code = receipt_code + "2";
                            additional_type = "국가유공자자녀";
                        }
                    }

                    if(String(userList[i].receipt_code).length === 1) 
                        receipt_code = receipt_code + "00" + String(userList[i].receipt_code);
                    else if(String(userList[i].receipt_code).length === 2)
                        receipt_code = receipt_code + "0" + String(userList[i].receipt_code);
                    else 
                        receipt_code = receipt_code + String(userList[i].receipt_code); 

                    if(userData[0].sex === "MALE") gender = "남";
                    else gender = "여";

                    let option:object = {}, student_class: string, scores: object;
                    if(userData && exam_code && gender) {
                        if(userData[1] === "ged") {
                            background = "검정고시";
                        }
                        else {
                            option["school"] = userData[0].school_name;
                            student_class = userData[0].student_number.split('');
                            option["class"] = student_class[1]+student_class[2];
                            option["first"] = userData[0].first_grade_score;
                            option["second"] = userData[0].second_grade_score;
                            option["third"] = userData[0].third_grade_score;
                            option["volunteer_time"] = userData[0].volunteer_time;
                            option["full_cut"] = userData[0].full_cut_count;
                            option["period_cut"] = userData[0].period_cut_count;
                            option["early_leave"] = userData[0].early_leave_count;
                            option["late"] = userData[0].late_count;
                            scores = await ListController.assginScores(userData[0]);
                            option = Object.assign(option, scores);
                            if(userData[1] === "gred") {
                                background = "졸업";
                                option["graduated_year"] =  userData[0].graduated_year;
                            }
                            else {
                                background = "졸업예정";
                                option["graduated_year"] =  "2020";
                            }
                        }  
                        await sheet.addRow(Object.assign({exam_code: exam_code, receipt_code: receipt_code, address: userData[0].address, region: region, apply_type: apply_type, 
                            name: userData[0].name, birth_day: userData[0].birth_date ,background: background, gender:gender, graduated_year: graduated_year,
                            phone: userData[0].applicant_tel, parent_name: userData[0].parent_name, parent_tel: userData[0].parent_tel, conversion: user.conversion_score,
                            volunteer_score: user.volunteer_score, attendance_score: user.attendance_score, final: user.final_score, additional_type: additional_type, 
                            study_plan: userData[0].study_plan, self_introduction: userData[0].self_introduction
                            }, option));
                        count++;
                    }
                }
            }
        } else {
            return sheet;
        }
    }

    static assginScores = (userData):object => {
        let subjects = ["korean", "social", "history", "math", "science", "tech_and_home", "english"];
        let result:object = {};
        let temp:Array<string>;
        for(let i=1; i<=6; i++) {
            for(let j=0; j<subjects.length; j++) {
                temp = userData[subjects[j]].split('');
                if(temp[i-1]) {
                    result[`${subjects[j]}${i}`] = temp[i-1];
                }
            }
        }
        return result;
    }
}

class excelForm {
    public header: string;
    public key: string;
    public width: number;
    constructor(header: string, key: string, width: number) {
        this.header = header;
        this.key = key;
        this.width = width;
    }
}

export default ListController;