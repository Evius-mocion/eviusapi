

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('invite_collaborator')
export class inviteCollaborator {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({nullable: false})
    userHost: string;

    @Column({nullable: false})
    eventName: string;
    
    @Column({nullable: false})
    email: string;
    
    @Column({nullable: false})
    eventId: string;

    @Column({nullable: false, enum: ["owner","admin","member"], default:"member"})
    role: string;

    @Column({nullable: false, enum: ["pending","accepted","rejected"], default:"pending"})
    status: string;

    @Column({nullable: false, default: new Date()})
    date: string;

}
