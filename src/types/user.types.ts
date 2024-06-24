export interface UserContext {
    id: string;
    rol?: string;
    organizationId?: string;
}

export type typeAccount = 'client' | 'assistant';

export type genderType = "male" | "female"