import { Column, Entity, PrimaryGeneratedColumn, } from "typeorm";


@Entity('recovery_codes')
export class RecoveryCode {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false, unique: true})
    email: string;

    @Column({nullable: false})
    code: string;

    @Column({nullable: true})
    expAt: Date;
}
