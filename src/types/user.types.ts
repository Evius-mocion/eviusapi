
export interface UserContext {
    id: string;
    rol?: string;
    eventId?: string
    isAdmin?: boolean
}

export type typeAccount = 'client' | 'attendee';

export type genderType = "male" | "female"