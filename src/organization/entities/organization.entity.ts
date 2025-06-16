
import { Collaborator } from "src/collaborator/entities";
import { User } from "src/common/entities";
import { Event } from "src/event/entities/event.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

 type IOrganizationSocialMedia = {
  facebookUrl?: string;
  linkedInUrl?: string;
  xUrl?: string;
  instagramUrl?: string;
};
@Entity("organizations")
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;
  
  @Column({nullable: true, default: ""})
  description: string;

  @Column({ nullable: true, default: "" })
  avatar: string;

  @OneToMany(() => Event, (event) => event.organization, {eager: false})
  events: Event[];

  @Column({ nullable: true, default: "" })
  contactEmail: string;

  @Column({ nullable: true, default: "" })
  contactPhone?: string;

  @Column({ nullable: true, default: "" })
  myWebsiteUrl?: string;

  @ManyToOne(() => User, (user) => user.organizations, {eager: false})
  user: User;

  @Column({
    nullable: true,
    type: "simple-json",
    default: { facebookUrl: "", linkedInUrl: "", xUrl: "", instagramUrl: "" },
  })
  socialMedias?: IOrganizationSocialMedia;

  @Column({ default: new Date() })
  created_at: Date;

  @Column({ default: true})
  isActive: boolean;

  @Column({ default: new Date() })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;
}
