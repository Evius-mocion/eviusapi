import { RoleType } from "src/types/collaborator.types"

export const JWT_SECRET = 'asdadasdads'

export const RoleEnum : Record<RoleType, number> ={
    owner: 4,
    admin: 3,
    editor: 2,
    auditor: 1,
}

export const Roles  : Record<RoleType, RoleType> = {
    owner: "owner",
    admin: "admin",
    editor: "editor",
    auditor: "auditor",
}