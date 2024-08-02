
export interface IDates {
    startDate: string;
    endDate: string;
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
    placeholder: string;
    name: string;
    type: 'text' | 'number' | 'select' | 'multi-select';
    options?: { label: string; value: string };
    rules?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
    };
};
export interface IEventAppearance {
    textColor: string;
    primaryColor: string;
    bgColor: string;
    bannerImage?: string;
}

export interface IEventSections {
    news: boolean;
    sponsors: boolean;
}
