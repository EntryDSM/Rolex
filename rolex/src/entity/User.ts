import {
    Entity, 
    PrimaryColumn, 
    Column,
    Unique,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
export class User {
    @IsNotEmpty()
    @PrimaryColumn({ length: "100" })
    email: string;

    @IsNotEmpty()
    @Column({ length: "100" })
    password: string;

    @IsNotEmpty()
    @Column()
    receipt_code: number;

    @Column("bool")
    is_paid: boolean;

    @Column("bool")
    is_printed_application_arrived: boolean;

    @Column("bool")
    is_passed_first_apply: boolean;

    @Column("bool")
    is_passed_interview: boolean;

    @Column("bool")
    is_final_submit: boolean;

    @Column({ length: "6" })
    exam_code: string;

    @Column("decimal", { precision: 10, scale: 5 })
    volunteer_score: number;

    @Column()
    attendance_score: number;

    @Column("decimal", { precision: 10, scale: 5 })
    conversion_score: number;

    @Column("decimal", { precision: 10, scale: 5 })
    final_score: number;
}