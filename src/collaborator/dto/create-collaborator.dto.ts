import { IsString } from "class-validator";
import { Organization } from "src/organization/entities/organization.entity";
import { CollaboratorRoll } from "src/types/collaborator.types";

export class CreateCollaboratorDto {

    @IsString()
    user_id: string;

    @IsString()
    organization: Organization;


    @IsString()
    rol: CollaboratorRoll;
}
