import {
    Entity, 
    PrimaryColumn, 
    Column,
} from "typeorm";

@Entity()
export class Ged_application {
    @PrimaryColumn({ length: "100"})
    user_email: string;

    @Column({ length: "45" })
    apply_type: string;

    @Column({ length: "45" })
    additional_type: string;

    @Column("bool")
    is_daejeon: boolean;

    @Column({ length: "15" })
    name: string;

    @Column({ length: "45" })
    sex: string;

    @Column()
    birth_date: Date;

    @Column({ length: "15" })
    parent_name: string;

    @Column({ length: "11" })
    parent_tel: string;

    @Column({ length: "11" })
    applicant_tel: string;

    @Column({ length: "500" })
    address: string;

    @Column({ length: "5" })
    post_code: string;

    @Column("decimal", { precision: 10, scale: 5 })
    ged_average_score: number;

    @Column({ length: "1600" })
    self_introduction: string;

    @Column({ length: "1600" })
    study_plan: string;
}