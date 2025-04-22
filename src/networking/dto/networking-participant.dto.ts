import { IsEnum } from "class-validator";
import { NetworkingRole } from "../entities/networking-participant.entity";

export class AssignRoleDto {
	@IsEnum(NetworkingRole)
	role: NetworkingRole;
}
