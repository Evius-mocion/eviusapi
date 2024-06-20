
export interface IEvent {
    id: string;
    name: string;
    description: string;
    type: typeEvent;
    appearance: IEventAppearance;
    eventSection?: Partial<IEventSections>;
}

export interface IEventAppearance {
    textColor: string;
    primaryColor: string;
    bgColor: string;
}

export interface IEventSections {
    news: boolean;
    sponsors: boolean;
}

export type typeEvent = 'virtual' | 'physical' | 'mixto';