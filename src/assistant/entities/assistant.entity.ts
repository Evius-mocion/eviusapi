import { User } from "src/common/entities/user.entity";
import { Event } from "src/event/entities/event.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";


@Entity('assistants')
export class Assistant {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    fullName: string;

    @ManyToOne(() => User, user => user.assistants,{
        eager: true
    })
    user: User;
    @ManyToOne(() => Event, event => event.assistants, {
        eager: true
    })
    event: Event;

    @Column({nullable: false, default: false})
    TRM: boolean;

    @Column({nullable: false, default: new Date()})
    registerAt: Date;
}
