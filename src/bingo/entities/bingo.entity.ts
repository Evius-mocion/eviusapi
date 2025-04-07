import { Activity } from "src/activities/entities/activity.entity";
import { Event } from "src/event/entities/event.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("bingo")
export class Bingo {
    @Index()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({nullable: false})
    type: string;

    @Column({nullable: false , type: "enum", enum: [3,4,5]})
    size: number;

    @Column({nullable: true})
    banner: string;

    @Column({nullable: true})
    footer: string;

    @Column({nullable: true})
    background_color: string;

    @Column({nullable: true})
    background_image: string;

    @Column({nullable: true})
    brands: string;

    @Column({nullable: false, type: "json", default: {}})
    box_styles: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    //relations 
    @Index()
    @ManyToOne(() => Event, event => event.bingos)
    event: Event;

    @OneToOne(() => Activity, (activity) => activity.bingo)
	@JoinColumn()
    activity: Activity;

}
