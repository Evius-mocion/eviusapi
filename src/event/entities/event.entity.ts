import { Attendee } from "src/attendee/entities/attendee.entity";
import { User } from "src/common/entities/user.entity";
import { Organization } from "src/organization/entities/organization.entity";
import { Station } from "src/stations/entities/station.entity";
import {
  DynamicField,
  IDates,
  IEventAppearance,
  IEventSections,
  ILandingSection,
} from "src/types/event.type";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { defaultLandingSections } from "../constants/event.constants";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: "jsonb" })
  dates: IDates[];

  @Column({ nullable: false, type: "numeric", default: 20 })
  capacity: number;

  @Column({ nullable: false })
  initialDate: Date;

  @Column({ nullable: false})
  finishDate: Date;

  @Column({ nullable: false, default: "without description" })
  description: string;



  @ManyToOne(() => Organization, (org) => org.events, {
    eager: true,
  })
  organization: Organization;

  @OneToMany(() => Attendee, (attendee) => attendee.event)
  attendees: Attendee[];

  @OneToMany(() => Station, (station) => station.event, {
    eager: true,
  })
  stations: Station[];

  @Column({
    type: "jsonb",
    nullable: false,
    default: defaultLandingSections,
  })
  landingSections: ILandingSection[];

  @Column({
    nullable: true,
    default: "",
  })
  landingDescription?: string;

  @Column({
    nullable: false,
    type: "simple-json",
    default: {
      primaryColor: "#FFFFFF",
      textColor: "#352848",
      bgColor: "#F8F9FA",
      bannerImage: "",
    },
  })
  appearance: IEventAppearance;

  @Column({
    nullable: false,
    type: "simple-json",
    default: { news: false, sponsors: false },
  })
  eventSection?: Partial<IEventSections>;

  @Column({ nullable: false, type: "jsonb", default: [] })
  registrationFields?: DynamicField[];

  @Column({ nullable: false })
  price: number;

  @ManyToOne(() => User, (user) => user.events, {
    eager: true,
  })
  createdBy: User;

  @Column({ nullable: false })
  organizationAlias: string;

  @Column({ nullable: true })
  googleAnalyticsId?: string;

  @Column({ nullable: true })
  googleTagManager?: string;

  @Column({ nullable: true })
  faceBookPixelId?: string;

  @Column({ nullable: false, default: false })
  hiddenEventDates?: boolean;

  @CreateDateColumn()
  createAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
