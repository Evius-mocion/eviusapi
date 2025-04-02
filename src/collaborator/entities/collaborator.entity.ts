import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoleType } from '../../types/collaborator.types';
import { User } from "src/common/entities/user.entity";
import { Roles } from "src/constants/constants";
import { Event } from "src/event/entities/event.entity";


@Entity('collaborator')

export class Collaborator {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({default: Roles.auditor})
    rol: RoleType;

    @Column({default: new Date()})   
    created_at: Date;

    @Column({default: new Date()})
    updated_at: Date;

    @Column({nullable: true})
    deleteAt: Date;

    //Relations
    @ManyToOne(() => User, user => user.collaborators,{
        eager: true
    })
    user: User;

    @ManyToOne(() => Event, (event) => event.collaborators,{
        eager: false
    })
    event: Event;
}
