import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateCollaboratorDto, UpdateCollaboratorDto } from "./dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Collaborator, inviteCollaborator } from "./entities";
import { RoleEnum, Roles } from "src/constants/constants";
import { UserContext } from "src/types/user.types";
import { PaginationArgs } from "src/common/dto";
import { User } from "src/common/entities";
import { RoleType } from "src/types/collaborator.types";
import { Event } from "src/event/entities/event.entity";

@Injectable()
export class CollaboratorService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
   
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(Collaborator)
    private readonly collaboratorRepository: Repository<Collaborator>,
    
    @InjectRepository(inviteCollaborator)
    private readonly inviteCollaboratorRepository: Repository<inviteCollaborator>,
   
  ) {}
  async create(createCollaboratorDto: CreateCollaboratorDto) {
    try {
      const Collaborator = this.collaboratorRepository.create(
        createCollaboratorDto,
      );

      return this.collaboratorRepository.save(Collaborator);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error creating collaborator")
    }
  }
 

  async findAll(eventId: string) {
    const collaborators = await this.collaboratorRepository.find({
      where: { event: {id: eventId}, deleteAt: null },
    });

    return {
      collaborators: collaborators.map((collaborator) => ({
        id: collaborator.id,
        avatar: collaborator.user.avatar,
        name : collaborator.user.fullName,
        email: collaborator.user.email,
        rol: collaborator.rol,
      }))
    };
  }

  async findAllByUserID(user_id: string) {
    return this.collaboratorRepository.find({
      where: {
        user : {id: user_id},
        deleteAt: null,
      },
      relations: ["organization"],
    });
  }

  async findOneById(id: string) {
    try {
      return this.collaboratorRepository.findOneBy({ user: {id} });
    } catch (error) {
      return null;
    }
  }
  async findOneByUserIdAndEventId(id: string, eventId: string = "") {
    try {
      const collaborator = await this.collaboratorRepository.findOneBy({
        user: {id},
        event: {id: eventId},
      });
      return collaborator;
    } catch (error) {
      return null;
    }
  }

  async update(id: string, updateCollaboratorDto: UpdateCollaboratorDto, user: UserContext) {

    if(RoleEnum[updateCollaboratorDto.rol] > RoleEnum[user.rol]) {
      throw new ForbiddenException("You can't update a collaborator with a higher role than yours");
    }

    if(user.rol === Roles.owner && updateCollaboratorDto.rol === Roles.owner) {
      await this.collaboratorRepository.update(user.id, {rol: Roles.admin});
    }

   await this.collaboratorRepository.update(id, {rol: updateCollaboratorDto.rol});
    
    return `This action updates a #${id} collaborator`;
  }

  remove(id: number) {
    return `This action removes a #${id} collaborator`;
  }

  //invitaciones 

  async getInvitationsByEvent( eventId: string, pagination: PaginationArgs,status?: string) {

    const { offset, limit } = pagination;

    const [invitations, total ]= await this.inviteCollaboratorRepository.findAndCount({
      where: {eventId, status},
      take: limit,
      skip: (offset - 1) * limit,
    });  

    return {
        invitations,
        total
    }
  
}

async rejectInvitation( invitationId: string) {
  try {

    await this.inviteCollaboratorRepository.update(invitationId, {status: "rejected"});
    return {
      message: "Invitation rejected"
    }
  } catch (error) {
      console.log(error);
      throw new BadRequestException("Error rejecting invitation");
  }
}

async getInvitationsByUser( userContext: UserContext, status?: string) {

  const user = await this.userRepository.findOneBy({id: userContext.id});
    
    const [invitations, total ]= await this.inviteCollaboratorRepository.findAndCount({
      where: {email: user.email, status},
    });  

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
        organization: invitation?.eventName,
        status: invitation?.status,
        role: invitation?.role,
    }
  } catch (error) {
      console.log(error);
      throw new BadRequestException("Error getting invitation");
  }
}
  async register(user: UserContext, invitationId: string) {
      const activeUser = await this.userRepository.findOneBy({id: user.id});
     
      const invitation = await this.inviteCollaboratorRepository.findOneBy({id: invitationId, status: "pending"});

      if (!invitation || activeUser.email !== invitation.email) {
        throw new ForbiddenException("you don't have invitation to this event");
      }

      const event = await this.eventRepository.findOne({
        where: {id: invitation.eventId, deletedAt: null},
      });

     

      const Collaborator =  this.collaboratorRepository.create(
        {
          event,
          rol: invitation.role as RoleType,
          user: activeUser,
        }
      );

      await this.inviteCollaboratorRepository.update(invitationId, {status: "accepted"});
      return {
        event,
        rol: Collaborator.rol,
      }
  }
}
