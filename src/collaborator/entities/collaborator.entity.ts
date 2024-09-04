import { Organization } from "src/organization/entities/organization.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoleType } from '../../types/collaborator.types';
import { User } from "src/common/entities/user.entity";
import { Roles } from "src/constants/constants";


@Entity('collaborator')

export class Collaborator {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ManyToOne(() => User, user => user.collaborators,{
        eager: true
    })
    user: User;

    @ManyToOne(() => Organization, organization => organization.collaborators,{
        eager: true
    })
    organization: Organization;

    @Column({default: Roles.auditor})
    rol: RoleType;

    @Column({default: new Date()})   
    created_at: Date;

    @Column({default: new Date()})
    updated_at: Date;

    @Column({nullable: true})
    deleteAt: Date;
}
