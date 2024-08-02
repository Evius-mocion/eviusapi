import { Assistant } from "src/assistant/entities/assistant.entity";
import { Organization } from "src/organization/entities/organization.entity";
import {  DynamicField, IDates, IEventAppearance, IEventSections } from "src/types/event.type";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, } from "typeorm";

@Entity('events')

export class Event {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({nullable: false})
    name: string;
    
    @Column({nullable: false, type: "jsonb", })
    dates: IDates[];

    @Column({nullable: false, type: "numeric", default: 20 })
    capacity: number;

    @Column({nullable: false, default: new Date().toISOString()})
    initialDate: string;

    @Column({nullable: false, default: new Date().toISOString()})
    finishDate: string;

    @Column({nullable: false, default: 'without description'})
    description: string;

    
    @ManyToOne(() => Organization, org => org.events , {
        eager: true
    }) 
    organization: Organization;

    @OneToMany(() => Assistant, assistant => assistant.event)
    assistants: Assistant[];

    @Column({nullable: false, type: 'simple-json', default: {primaryColor: '#FFFFFF', textColor: '#352848', bgColor: '#F8F9FA', bannerImage: ''}})
    appearance: IEventAppearance;

    @Column({nullable: false, type: 'simple-json', default: {news: false, sponsors: false}})
    eventSection?: Partial<IEventSections>;
    
    @Column({nullable: false, type: "jsonb", default: []})
    registrationFields?: DynamicField[];

    @Column({nullable: true})
    organizationAlias?: string;

    @Column({nullable: true})
    googleAnalyticsId?: string;

    @Column({nullable: true})
    googleTagManager?: string;

    @Column({nullable: true})
    faceBookPixelId?: string;

    @Column({nullable: false, default: false})
    hiddenEventDates?: boolean;

    @CreateDateColumn()
    createAt: string;

    @DeleteDateColumn()
    deletedAt: Date;
}
