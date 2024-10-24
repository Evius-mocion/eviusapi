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

export const NavigatorEnum = {
    chorme : "Google Chrome",
    firefox : "Mozilla Firefox",
    safari : "Apple Safari",
    edge : "Microsoft Edge",
    opera : "Opera",
    postman: "Postman",
    unknown : "Desconoicdo"
}