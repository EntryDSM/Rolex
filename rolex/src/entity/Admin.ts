import {
    Entity, 
    PrimaryColumn, 
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";

export enum AdminType {
    ROOT="ROOT",
    ADMINISTRATION="ADMINISTRATION",
    INTERVIEW="INTERVIEW"
}

@Entity()
@Unique(["admin_id"])
export class Admin {

    @PrimaryColumn({ length: "45" })
    admin_id: string;

    @IsNotEmpty()
    @Column({ length: "100" }) //60
    admin_password: string;

    @IsNotEmpty()
    @Column({
        type: "enum",
        enum: AdminType,
        default: AdminType.ADMINISTRATION
    })
    admin_type: AdminType;

    @IsNotEmpty()
    @Column({ length: "320" })
    admin_email: string;

    @IsNotEmpty()
    @Column({ length: "13" })
    admin_name: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    hashPassword() {
        this.admin_password = bcrypt.hashSync(this.admin_password, 10);
    }

    checkPassword(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.admin_password);
    }
}
