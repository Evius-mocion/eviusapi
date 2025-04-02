import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { RoleType } from "src/types/collaborator.types";
import { RoleEnum } from "src/constants/constants";
import { CollaboratorService } from "src/collaborator/collaborator.service";
import { SUPER_ADMIN } from '../decorators';
import { UserContext } from 'src/types/user.types';

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
    
    const requiredAdmin = this.reflector.getAllAndOverride<boolean>(SUPER_ADMIN, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRole && !requiredAdmin) {
      return true;
    }


    const { user } = context.switchToHttp().getRequest() as { user: UserContext };
    
    if (requiredAdmin && !user.isAdmin) {
      throw new ForbiddenException("You don't have permission to access this resource, contact an administrator");
    }
    

    if(user.isAdmin){
      return true;
    }

    const collaborator = await this.CollaboratoService.findOneByUserIdAndEventId(user.id,user.eventId);
    
    const rol = collaborator?.rol;
    

    if(RoleEnum[rol] >= RoleEnum[requiredRole]){
      return true;
    }else{
      throw new ForbiddenException("You don't have permission to access this resource");
    }
  }
  
}
