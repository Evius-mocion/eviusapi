import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Activity } from "./activity.entity";


@Entity('documents')
export class Document {

    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column({ nullable: false, enum: ['img', 'pdf', 'xlsx', 'img'] })
    type: string;

    @Column({ nullable: false, default: "without description" })
    description: string;

    @Column({ nullable: true })
    url: string;

    @ManyToOne(() => Activity, (activity) => activity.documents, {
        eager: false,
    })
    Activity: Activity;

    @CreateDateColumn({type: 'timestamptz'})
    createdAt: Date;

}


