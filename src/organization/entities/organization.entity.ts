import { Collaborator } from "src/collaborator/entities/collaborator.entity";
import { Event } from "src/event/entities/event.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('organizations')
export class Organization {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    name: string;

    @Column()
    avatar: string;
    
    @OneToMany(() => Collaborator, collaborator => collaborator.organization)
    collaborators: Collaborator[];

    @OneToMany(() => Event, event => event.organization)
    events: Event[];

    @Column({default: new Date()})
    created_at: Date;

    @Column({default: new Date()})
    updated_at: Date;

    @Column({nullable: true})
    deleted_at: Date;
}
