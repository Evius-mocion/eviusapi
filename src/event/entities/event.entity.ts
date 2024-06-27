import { Assistant } from "src/assistant/entities/assistant.entity";
import { Organization } from "src/organization/entities/organization.entity";
import {  IDates, IEventAppearance, IEventSections, typeEvent } from "src/types/event.type";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, } from "typeorm";

@Entity('events')

export class Event {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    name: string;
    
    @Column({nullable: false, type: "jsonb", })
    dates: IDates[];

    @Column({nullable: false, default: new Date().toISOString()})
    initialDate: string;

    @Column({nullable: false, default: new Date().toISOString()})
    finishDate: string;

    @Column({nullable: false, default: 'without description'})
    description: string;

    @Column({nullable: false, enum: ['virtual' , 'physical' , 'mixto'],default: 'virtual'})
    type: typeEvent;
    
    @ManyToOne(() => Organization, org => org.events , {
        eager: true
    })
    organization: Organization;

    @OneToMany(() => Assistant, assistant => assistant.event)
    assistants: Assistant[];

    @Column({nullable: false, type: 'simple-json', default: {textColor: '#000000', primaryColor: '#000000', bgColor: '#000000'}})
    appearance: IEventAppearance;

    @Column({nullable: false, type: 'simple-json', default: {news: false, sponsors: false}})
    eventSection?: Partial<IEventSections>;

    @CreateDateColumn()
    createAt: string;

    @DeleteDateColumn()
    deletedAt: Date;
}
