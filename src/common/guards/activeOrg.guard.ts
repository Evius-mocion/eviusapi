import { CanActivate, ExecutionContext, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { OrganizationService } from "src/organization/organization.service";
import { Not } from "typeorm";

@Injectable()
export class ActiveOrgGuard implements CanActivate {
  constructor(
    private readonly organizationService: OrganizationService, // Replace 'any' with the actual type of your organization service
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const orgId = request.params.orgId;
    if (!orgId) {
      console.error("Organization ID is missing in the request parameters.");
      return false;
    }

    const org = await this.organizationService.findOne(orgId);
    
    if (!org.organization) {
      console.error(`Organization with ID ${orgId} not found.`);
      throw new NotFoundException(`Organization with ID ${orgId} not found.`);
    }

    if (!org.organization.isActive) {
      console.error(`Organization with ID ${orgId} is not active.`);
      throw new ForbiddenException(`Organization with ID ${orgId} is not active.`);
    }

    return true;
  }
}