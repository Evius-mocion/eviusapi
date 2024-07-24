import { RoleType } from "src/types/collaborator.types"

export const JWT_SECRET = 'asdadasdads'

export const RoleEnum : Record<RoleType, number> ={
    owner: 3,
    admin: 2,
    member: 1
}