import { Organization } from "src/organization/entities/organization.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { CollaboratorRoll } from '../../types/collaborator.types';
import { CollaboratorROlEnum } from '../../constants/constants';


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

    @Column({default: CollaboratorROlEnum.member})
    rol: CollaboratorRoll;

    @Column({default: new Date()})   
    created_at: Date;

    @Column({default: new Date()})
    updated_at: Date;
}
