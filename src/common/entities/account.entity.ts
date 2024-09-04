import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, } from "typeorm";

@Entity('accounts')
export class Accounts {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    userId: string;
    
    @Column({nullable: false})
    email: string;
    
    @Column({nullable: false})
    type: string;
    
    @Column({nullable: false})
    name: string;

    @Column({nullable: true})
    password: string;

    @DeleteDateColumn()
    deletedAt: Date;
}
