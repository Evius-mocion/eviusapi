import { User } from "src/common/entities/user.entity";
import { Organization } from "src/organization/entities/organization.entity";
import { RoleType } from "src/types/collaborator.types";

export class CreateCollaboratorDto {

    
    user: User;

  
    organization: Organization;


   
    rol: RoleType;
}
