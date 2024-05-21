import { CollaboratorRoll } from "src/types/collaborator.types"

export const JWT_SECRET = 'asdadasdads'

export const CollaboratorROlEnum : Record<CollaboratorRoll, CollaboratorRoll> ={
    owner: 'owner',
    admin: 'admin',
    member: 'member'
}