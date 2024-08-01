import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Organization } from "./entities/organization.entity";
import { CollaboratorService } from "src/collaborator/collaborator.service";
import { UserContext } from "src/types/user.types";
import { User } from "src/common/entities/user.entity";
import { inviteCollaborator } from "src/collaborator/entities/inviteCollaborator.entity";
import { RoleType } from "src/types/collaborator.types";
import { Roles } from "src/constants/constants";
import { PaginationArgs } from "src/common/dto";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly collaboratorService: CollaboratorService,

    @InjectRepository(inviteCollaborator)
    private readonly inviteCollaboratorRepository: Repository<inviteCollaborator>,
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
        rol: Roles.owner,
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

  async register(user: UserContext, invitationId: string) {
      const activeUser = await this.userRepository.findOneBy({id: user.id});
     
      const invitation = await this.inviteCollaboratorRepository.findOneBy({id: invitationId, status: "pending"});

      if (!invitation || activeUser.email !== invitation.email) {
        throw new ForbiddenException("you don't have invitation to this organization");
      }

      const organization = await this.organizationRepository.findOne({
        where: {id: invitation.organizationId},
        relations: ["collaborators"],
      });

     const isCollaborator = organization.collaborators.map((collaborator) => (collaborator.user.id)).includes(activeUser.id);

      if (isCollaborator) {
        throw new ConflictException("You are already a member of this organization");
      }

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
  }
  async getInvitations( orgId: string, pagination: PaginationArgs) {

      const { offset, limit } = pagination;

      
     
      
      const [invitations, total ]= await this.inviteCollaboratorRepository.findAndCount({
        where: {organizationId: orgId},
        take: limit,
        skip: (offset - 1) * limit,
      });  

      

      return {
          invitations,
          total
      }
    
  }
  async getInvitationsByUser( userContext: UserContext) {

    const user = await this.userRepository.findOneBy({id: userContext.id});
      
      const [invitations, total ]= await this.inviteCollaboratorRepository.findAndCount({
        where: {email: user.email},
      });  

      if (total === 0) {
        throw new NotFoundException("You don't have invitations");
      }

      return {
          invitations,
          total
      }
    
  }
  async invitationStatus( invitationId: string) {
    try {
      const invitation = await this.inviteCollaboratorRepository.findOneBy({id: invitationId});  
      if(!invitation){
        throw new NotFoundException("Invitation not found");
      }
      return {
          id: invitation?.id,
          email: invitation?.email,
          organization: invitation?.organizationName,
          status: invitation?.status,
          role: invitation?.role,
      }
    } catch (error) {
        console.log(error);
        throw new BadRequestException("Error getting invitation");
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

  async findOne(organizationID: string) {
     const organization = await this.organizationRepository.findOneBy({ id: organizationID})

     return {
      organization
      }
  }

  async getAccessOrganization(organizationID: string, userID:string) {
    const organization = await this.organizationRepository.findOneBy({ id: organizationID})
    const collaborator = await this.collaboratorService.findOneByIdAndOrganizationId(userID,organizationID);
    return {
     organization,
     rol:collaborator.rol
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
