import { Attendee } from 'src/attendee/entities/attendee.entity';
import { User } from 'src/common/entities/user.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { Station } from 'src/stations/entities/station.entity';
import { DynamicField, IDates, IEventAppearance, IEventSections, ILandingSection } from 'src/types/event.type';
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Index,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { defaultLandingSections } from '../constants/event.constants';
import { Categories } from './category.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { Survey } from 'src/survey/entities/survey.entity';
import { Auction } from 'src/auction/entities/auction.entity';
import { Collaborator } from 'src/collaborator/entities';
import { Bingo } from 'src/bingo/entities/bingo.entity';
import { ElementHuntGame } from 'src/element-hunt-game/entities/element-hunt-game.entity';
import { Networking } from 'src/networking/entities/networking.entity';
import { Millionaire } from 'src/millionaire/entities/millionaire.entity';
import { EventExperience } from 'src/experiences/entities/event-experience.entity';
@Entity('events')
export class Event {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	// 🟢 Columnas normales
	@Column({ nullable: false })
	name: string;

	@Column({ nullable: false, default: 'online', enum: ['online', 'onsite', 'payment', 'hibrid'] })
	type: string;

	// Esto se actualiza segun la fecha de inicio y fin del evento
	@Column({ nullable: false, default: 'in_process', enum: ['in_process', 'executed', 'canceled'] })
	state: string;

	@Column({ nullable: false, type: 'jsonb' })
	dates: IDates[];

	@Column({ nullable: false, type: 'integer', default: 20 })
	capacity: number;

	@Column({ nullable: false })
	initialDate: Date;

	@Column({ nullable: false })
	finishDate: Date;

	@Column({ nullable: false, default: 'without description' })
	description: string;

	@Column({
		type: 'jsonb',
		nullable: false,
		default: defaultLandingSections,
	})
	landingSections: ILandingSection[];

	@Column({
		nullable: true,
		default: '',
	})
	landingDescription?: string;

	@Column({
		nullable: false,
		type: 'simple-json',
		default: {
			primaryColor: '#FFFFFF',
			textColor: '#352848',
			bgColor: '#F8F9FA',
			bannerImage: '',
		},
	})
	appearance: IEventAppearance;

	@Column({
		nullable: false,
		type: 'simple-json',
		default: { news: false, sponsors: false },
	})
	eventSection?: Partial<IEventSections>;

	@Column({ nullable: false, type: 'jsonb', default: [] })
	registrationFields?: DynamicField[];

	@Column({ nullable: false })
	price: number;

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

	// 🔵 Relaciones

	@OneToMany(() => Survey, (survey) => survey.event)
	surveys: Survey[];

	@OneToMany(() => Attendee, (attendee) => attendee.event)
	attendees: Attendee[];

	@Index()
	@ManyToOne(() => Organization, (org) => org.events, {
		eager: false,
	})
	organization: Organization;

	@OneToMany(() => Categories, (category) => category.event, {
		eager: false,
	})
	categories: Categories[];

	@OneToMany(() => Activity, (activity) => activity.event, {
		eager: false,
	})
	activities: Activity[];

	@OneToMany(() => Collaborator, (collaborator) => collaborator.event, {
		eager: false,
	})
	collaborators: Collaborator[];

	@OneToMany(() => Auction, (auction) => auction.event, {
		eager: false,
	})
	auction: Auction[];

	@OneToMany(() => Station, (station) => station.event, {
		eager: false,
	})
	stations: Station[];

	@OneToMany(() => Bingo, (bingo) => bingo.event, {
		eager: false,
	})
	bingos: Bingo[];

	@ManyToOne(() => User, (user) => user.events, {
		eager: false,
	})
	createdBy: User;

	@OneToOne(() => ElementHuntGame, (elementHuntGame) => elementHuntGame.event)
	elementHuntGame: ElementHuntGame;

	@OneToOne(() => Networking, (networking) => networking.event, {
		eager: false,
	})
	networking: Networking;

	@OneToMany(() => Millionaire, (millionaire) => millionaire.event, {
		eager: false,
	})
	millionaire: Millionaire[];

	@OneToMany(() => EventExperience, (evenExperience) => evenExperience.event, {
		eager: false,
	})
	eventExperiences: EventExperience[];
}
