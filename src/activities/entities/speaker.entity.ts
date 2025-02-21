import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Activity } from "./activity.entity";


@Entity('speakers')
export class Speaker {

    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, default: "without description" })
    description: string;

    @Column({ nullable: true })
    image: string;

    @ManyToOne(() => Activity, (activity) => activity.documents, {
        eager: false,
    })
    Activity: Activity;

    @CreateDateColumn({type: 'timestamptz'})
    createdAt: Date;

}


