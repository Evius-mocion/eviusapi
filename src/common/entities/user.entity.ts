import { Attendee } from "src/attendee/entities/attendee.entity";
import { Collaborator } from "src/collaborator/entities/collaborator.entity";
import { Event } from "src/event/entities/event.entity";
import { Organization } from "src/organization/entities/organization.entity";
import { genderType, typeAccount } from "src/types/user.types";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')

export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    fullName: string;
    
    @Column({nullable: true})
    avatar: string;
    
    @Column({nullable: true})
    phoneNumber: string;

    @Column({nullable: true})
    birthDate: Date;
    
    @Column({nullable: true})
    residenceCountry: string;

    @Column({nullable: true})
    gender:  genderType;

    @Column({nullable: false, enum: ["attendee","client"], default:"attendee"})
    type_account: typeAccount;

    @OneToMany(() => Attendee, attendee => attendee.user)
    attendees: Attendee[];
    
    @OneToMany(() => Collaborator, collaborator => collaborator.user)
    collaborators: Collaborator[];

    @OneToMany(() => Organization, orga => orga.user)
    organizations: Organization[];

    @OneToMany(() => Event, event => event.createdBy)
    events: Event[];

    @Column({nullable: false, unique: true})
    email: string;

    @Column({nullable: true,enum: ["admin","owner","user"], default:"user"})
    rol: string;
    
    @Column({nullable: true})
    password: string;

    @Column({nullable: false, default: true})
    isLoginFirstTime: boolean;

    @CreateDateColumn()
    createAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
