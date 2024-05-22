import { RoleType } from "src/types/collaborator.types"

export const JWT_SECRET = 'asdadasdads'

export const RoleEnum : Record<RoleType, RoleType> ={
    owner: 'owner',
    admin: 'admin',
    member: 'member'
}