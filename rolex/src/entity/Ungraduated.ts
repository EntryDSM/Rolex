import {
    Entity, 
    PrimaryColumn, 
    Column,
} from "typeorm";

@Entity()
export class Ungraduated_application {
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

    @Column({ length: "5" })
    student_number: string;

    @Column({ length: "4" })
    graduated_year: string;

    @Column({ length: "10" })
    school_name: string;

    @Column({ length: "11" })
    school_tel: string;

    volunteer_time: number;

    full_cut_count: number;

    period_cut_count: number;

    late_count: number;

    early_leave_count: number;

    @Column({ length: "6" })
    korean: string;

    @Column({ length: "6" })
    social: string;

    @Column({ length: "6" })
    history: string;

    @Column({ length: "6" })
    math: string;

    @Column({ length: "6" })
    science: string;

    @Column({ length: "6" })
    tech_and_home: string;

    @Column({ length: "6" })
    english: string;

    @Column({ length: "1600" })
    self_introduction: string;

    @Column({ length: "1600" })
    study_plan: string;
}