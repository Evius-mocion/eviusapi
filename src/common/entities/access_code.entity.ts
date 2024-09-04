import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('access_codes')
export class accessCode {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false, unique: true})
    email: string;
    
    @Column({nullable: false})
    eventId: string;

    @Column({nullable: false})
    code: string;

    @Column({nullable: true})
    expAt: Date;

}
