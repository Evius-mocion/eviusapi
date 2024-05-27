import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Organization } from "./entities/organization.entity";
import { CollaboratorService } from "src/collaborator/collaborator.service";
import { RoleEnum } from "src/constants/constants";
import { UserContext } from "src/types/user.types";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    private readonly collaboratorService: CollaboratorService,
  ) {}

  async create(
    user: UserContext,
    createOrganizationDto: CreateOrganizationDto,
  ) {
    try {
      const pre_org = this.organizationRepository.create(createOrganizationDto);
      const organization = await this.organizationRepository.save(pre_org);

      const collaborator = await this.collaboratorService.create({
        rol: RoleEnum.owner,
        organization,
        user_id: user.id,
      });
      return {
        organization,
        rol: collaborator.rol,
      };
    } catch (error) {
      this.controlDbErros(error);
    }
  }


  async findAllByContributorId(userID: string) {
    try {
      const collaborator = await this.collaboratorService.findAllByUserID(userID);
      return collaborator.map((c) => c.organization);
    } catch (error) {
      return []
    }
  }

  async findOne(userID: string,organizationID: string) {
     const collaborator = await this.collaboratorService.findOneByIdAndOrganizationId(userID,organizationID);
     
     if (!collaborator) {
       throw new ForbiddenException("You don't have permission to access this resource");
     }
     
     return {
        organization: collaborator?.organization,
        rol: collaborator?.rol,
      }
  }

  update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return `This action updates a #${id} organization`;
  }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }

  controlDbErros(error: any) {
    if (error.code === "23505") {
      throw new BadRequestException("Organization already exists");
    }
  }
}
