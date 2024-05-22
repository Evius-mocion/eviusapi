import { Organization } from "src/organization/entities/organization.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { RoleType } from '../../types/collaborator.types';
import { RoleEnum } from '../../constants/constants';


@Entity('collaborator')

export class Collaborator {
    @Column({type: 'uuid', generated: "uuid"})
    id: string;
    
    @PrimaryColumn()
    user_id: string;

    @ManyToOne(() => Organization, organization => organization.collaborators,{
        eager: true
    })
    organization: Organization;

    @Column({default: RoleEnum.member})
    rol: RoleType;

    @Column({default: new Date()})   
    created_at: Date;

    @Column({default: new Date()})
    updated_at: Date;
}
