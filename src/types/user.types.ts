
export interface UserContext {
    id: string;
    rol?: string;
    organizationId?: string
    isAdmin?: boolean
}

export type typeAccount = 'client' | 'attendee';

export type genderType = "male" | "female"