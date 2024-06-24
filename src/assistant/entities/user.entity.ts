import { genderType, typeAccount } from "src/types/user.types";
import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, } from "typeorm";
import { Assistant } from "./assistant.entity";

@Entity('users')

export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    fullName: string;
    
    @Column({nullable: true})
    avatar: string;
    
    @Column({nullable: true})
    phoneNumber: string;

    @Column({nullable: true})
    birthDate: Date;
    
    @Column({nullable: true})
    residenceCountry: string;

    @Column({nullable: true})
    gender:  genderType;

    @Column({nullable: false, enum: ["assistant","client"], default:"assistant"})
    type_account: typeAccount;

    @OneToMany(() => Assistant, assistant => assistant.user)
    assistants: Assistant[];

    @Column({nullable: false, unique: true})
    email: string;
    
    @Column({nullable: true})
    password: string;

    @DeleteDateColumn()
    deletedAt: Date;
}
