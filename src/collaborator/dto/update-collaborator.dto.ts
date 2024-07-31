
import { RoleType } from 'src/types/collaborator.types';
import { IsIn } from 'class-validator';
import { Roles } from 'src/constants/constants';

export class UpdateCollaboratorDto {
    @IsIn(Object.values(Roles))
    rol: RoleType;
}
