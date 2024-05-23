import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { RoleType } from "src/types/collaborator.types";
import { RoleEnum } from "src/constants/constants";
import { CollaboratorService } from "src/collaborator/collaborator.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly CollaboratoService: CollaboratorService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<RoleType>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const collaborator = await this.CollaboratoService.findOneById(user.id);
    const rol = collaborator?.rol;
    
    if (rol === RoleEnum.owner) {
      return true;
    }

    if(rol === requiredRole){
      return true;
    }else{
      throw new ForbiddenException("You don't have permission to access this resource");
    }
  }
}
