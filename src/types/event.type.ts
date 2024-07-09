
export interface IDates {
    startDate: string;
    endDate: string;
}
export interface IEvent {
    id: string;
    name: string;
    description: string;
    dates: IDates,
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
