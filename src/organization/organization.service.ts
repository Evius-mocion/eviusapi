import { BadRequestException, ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Organization } from "./entities/organization.entity";
import { CollaboratorService } from "src/collaborator/collaborator.service";
import { RoleEnum } from "src/constants/constants";
import { UserContext } from "src/types/user.types";
import { User } from "src/common/entities/user.entity";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly collaboratorService: CollaboratorService,
  ) {}

  async create(
    ActiveUser: UserContext,
    createOrganizationDto: CreateOrganizationDto,
  ) {
    try {
      const pre_org = this.organizationRepository.create(createOrganizationDto);
      const organization = await this.organizationRepository.save(pre_org);
      const user = await this.userRepository.findOneBy({id: ActiveUser.id});
      const collaborator = await this.collaboratorService.create({
        rol: RoleEnum.owner,
        organization,
        user
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
       return {
        organizations: collaborator.map((c) => ({...c.organization, rol: c.rol})),
       }
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

 

  remove(id: string) {
    try {
      this.organizationRepository.update(id, { deleted_at: new Date() });
    } catch (error) {
      
    }
  }

  controlDbErros(error: any) {
    if (error.code === "23505") {
      throw new ConflictException("Organization already exists");
    }
    throw new BadRequestException("Error creating organization");
  }
}
