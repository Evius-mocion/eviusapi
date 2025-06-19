import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between, IsNull, ILike, FindOptionsWhere } from "typeorm";
import { Organization } from "./entities/organization.entity";
import { UserContext } from "src/types/user.types";
import { User } from "src/common/entities/user.entity";
import { UpdateOrganizationDto } from "./dto/update-organization.dto";
import { Event } from "src/event/entities/event.entity";
import { Collaborator } from "src/collaborator/entities";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(Collaborator)
    private readonly collaboratorRepository: Repository<Collaborator>,
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

  async findAll(search?: string, isActive?: boolean) {
    try {
      const query: FindOptionsWhere<Organization> = {
          deleted_at: IsNull(),
      }

      if (search) {
        query.name = ILike(`%${search}%`);
      }
      
      if (isActive !== undefined) {
        query.isActive = isActive;
      }

      const organizations = await this.organizationRepository
      .createQueryBuilder("organization")
      .leftJoinAndSelect("organization.user", "user")
      .loadRelationCountAndMap('organization.eventsCount', 'organization.events')
      .loadRelationCountAndMap(
        'organization.eventsInProcessCount',
        'organization.events',
        'events',
        (qb) => qb.andWhere('events.state = :state', { state: 'in_process' })
      )
      // .loadRelationCountAndMap('organization.collaboratorsCount', 'organization.collaborators')
      .where(query)
      .getMany();

      return {
        organizations,
      };
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw new InternalServerErrorException("Error getting organization's user");
    }
  }

  async findOne(organizationID: string) {
    const [organization, eventStats, collaboratorRoleCounts] = await Promise.all([
      this.organizationRepository.findOne({
        where: { id: organizationID }
      }),

      // 2. Obtener estadísticas de eventos
      this.eventRepository
        .createQueryBuilder("event")
        .select("COUNT(event.id)", "count")
        .addSelect("MAX(event.initialDate)", "lastDate")
        .where("event.organizationId = :id", { id: organizationID })
        .leftJoin("event.collaborators", "collaborators") // Esta unión sigue siendo para eventos
        .getRawOne(),

      this.collaboratorRepository
        .createQueryBuilder("collaborator")
        .select("collaborator.rol", "rol")
        .addSelect("COUNT(collaborator.id)", "count")
        .innerJoin("collaborator.event", "event") // Unir collaborators con su evento
        .where("event.organizationId = :id", { id: organizationID }) // Filtrar por el ID de la organización del evento
        .andWhere("collaborator.rol IN (:...roles)", { roles: ["owner", "admin", "editor", "auditor"] })
        .groupBy("collaborator.rol")
        .getRawMany()
    ]);

    if (!organization) {
      throw new NotFoundException(`Organización con ID ${organizationID} no encontrada`);
    }

    const formattedRoleCounts = collaboratorRoleCounts.reduce((acc, current) => {
      acc[current.rol] = parseInt(current.count, 10);
      return acc;
    }, {
      owner: 0,
      admin: 0,
      editor: 0,
      auditor: 0
    });

    return {
      organization: {
        ...organization,
        eventsCount: parseInt(eventStats?.count) || 0,
        lastEventDate: eventStats?.lastDate || null,
        collaboratorCounts: formattedRoleCounts
      },
    };
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

  async getStats() {
    const now = new Date();
  
    // Rango para el mes actual
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
  
    // Rango para el mes pasado
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const endOfLastMonth = endOfMonth(subMonths(now, 1));
  
    const currentMonthCount = await this.organizationRepository.count({
      where: {
        created_at: Between(startOfCurrentMonth, endOfCurrentMonth),
      },
    });
  
    const lastMonthCount = await this.organizationRepository.count({
      where: {
        created_at: Between(startOfLastMonth, endOfLastMonth),
      },
    });
  
    const totalOrganizations = await this.organizationRepository.count();
  
    return {
      totalOrganizations,
      currentMonthCount,
      lastMonthCount,
    };
  }
  
}
