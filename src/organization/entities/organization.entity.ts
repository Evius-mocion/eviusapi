import { Collaborator } from "src/collaborator/entities/collaborator.entity";
import { Event } from "src/event/entities/event.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

  @Column({ nullable: true, default: "" })
  avatar: string;

  @OneToMany(() => Collaborator, (collaborator) => collaborator.organization)
  collaborators: Collaborator[];

  @OneToMany(() => Event, (event) => event.organization)
  events: Event[];

  @Column({ nullable: true, default: "" })
  contactEmail: string;

  @Column({ nullable: true, default: "" })
  contactPhone?: string;

  @Column({ nullable: true, default: "" })
  myWebsiteUrl?: string;

  @Column({
    nullable: true,
    type: "simple-json",
    default: { facebookUrl: "", linkedInUrl: "", xUrl: "", instagramUrl: "" },
  })
  socialMedias?: IOrganizationSocialMedia;

  @Column({ default: new Date() })
  created_at: Date;

  @Column({ default: new Date() })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;
}
