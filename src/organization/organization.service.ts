import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Organization } from "./entities/organization.entity";
import { UserContext } from "src/types/user.types";
import { User } from "src/common/entities/user.entity";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

  ) {}

  async create(
    user: UserContext,
    createOrganizationDto: CreateOrganizationDto,
  ) {
    try {
      const currentUser = await this.userRepository.findOneBy({id: user.id});

      const pre_org = this.organizationRepository.create({...createOrganizationDto, user: currentUser});
      const organization = await this.organizationRepository.save(pre_org);

      return {
        organization,
      };
    } catch (error) {
      this.controlDbErros(error);
    }
  }

  
 /*  async register(user: UserContext, invitationId: string) {
      const activeUser = await this.userRepository.findOneBy({id: user.id});
     
      const invitation = await this.inviteCollaboratorRepository.findOneBy({id: invitationId, status: "pending"});

      if (!invitation || activeUser.email !== invitation.email) {
        throw new ForbiddenException("you don't have invitation to this organization");
      }

      const organization = await this.organizationRepository.findOne({
        where: {id: invitation.organizationId},
        relations: ["collaborators"],
      });

     

      const Collaborator = await this.collaboratorService.create(
        {
          organization,
          rol: invitation.role as RoleType,
          user: activeUser,
        }
      );

      await this.inviteCollaboratorRepository.update(invitationId, {status: "accepted"});
      return {
        organization,
        rol: Collaborator.rol,
      }
  } */
  


  
  async findAll() {
    try {
      const organizations = await this.organizationRepository.find();
       return {
        organizations: organizations,
       }
    } catch (error) {
      throw new InternalServerErrorException("Error getting organization's user");
    }
  }

  async findOne(organizationID: string) {
     const organization = await this.organizationRepository.findOneBy({ id: organizationID})

     return {
      organization
      }
  }
/* 
  async getAccessOrganization(organizationID: string, userID:string) {
    const organization = await this.organizationRepository.findOneBy({ id: organizationID})
    const collaborator = await this.collaboratorService.findOneByIdAndOrganizationId(userID,organizationID);
    return {
     organization,
     rol:collaborator.rol
     }
 }
 */

 

  remove(id: string) {
    try {
      this.organizationRepository.update(id, { deleted_at: new Date() });
    } catch (error) {
      
    }
  }

  async update(id: string,data : UpdateOrganizationDto) {
    try {
     await this.organizationRepository.update(id, { ...data });

      return await this.organizationRepository.findOneBy({ id });
    } catch (error) {
      throw new BadRequestException("Error updating organization");
    }
  }

  controlDbErros(error: any) {
    if (error.code === "23505") {
      throw new ConflictException("Organization already exists");
    }
    throw new BadRequestException("Error creating organization");
  }
}
