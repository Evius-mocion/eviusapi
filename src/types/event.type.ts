export interface IDates {
  startDate: string;
  endDate: string;
}

export interface IContent {
  type : TypeContentConfig;
  link: string
  iframe: string;
  provider: TypeContentProvider;
}

export enum TypeContentConfig {
  stream = 'stream',
  video = 'video',
}

export enum TypeContentProvider {
  dacast = 'dacast',
  vimeo = 'vimeo',
  iframe = 'iframe',
  url = 'url',
}

export interface IEvent {
  id?: string;
  name: string;
  description: string;
  dates: IDates[];
  appearance: IEventAppearance;
  capacity: number;
  eventSection?: Partial<IEventSections>;
  registrationFields?: DynamicField[];
  createAt?: string;
  organizationAlias?: string;
  googleAnalyticsId?: string;
  googleTagManager?: string;
  faceBookPixelId?: string;
  hiddenEventDates?: boolean;
}

export type DynamicField = {
  label: string;
  placeholder?: string;
  name: string;
  dependsOn?: string;
  isRequerid: boolean;
  rules?: DynamicRuleObject;
  visibleToAdminsOnly?: boolean;
  type: "text"  | "number" | "select" | "phone" | "optionsButton";
  specialField: ("country" | "stateAndDepartment" | "city") | null;
  origin: FieldOrigin;
  dynamicVisibility?: {
    type: "major" | "minor" | "equal" | "different";
    value: string | number | null;
  };
};
export interface IEventAppearance {
  textColor: string;
  primaryColor: string;
  bgColor: string;
  bannerImage?: string;
}

export type FieldOrigin = "predefined" | "custom";
export type DynamicRuleObject = {
  min?: Rule<number>;
  max?: Rule<number>;
};

export interface Rule<T = string | number> {
  active: boolean;
  value: T;
  message?: string;
}

export interface IEventSections {
  news: boolean;
  sponsors: boolean;
}

export enum LandingSectionTitles {
  Counter = "counter",
  Description = "description",
  Speakers = "Conferencistas",
  Activities = "activities",
  Sponsors = "sponsors",
}

export interface ILandingSection {
  title: string;
  alias?: string;
  visible: boolean;
}
