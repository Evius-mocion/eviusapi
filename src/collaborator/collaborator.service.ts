import { ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateCollaboratorDto, UpdateCollaboratorDto } from "./dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Collaborator } from "./entities";
import { RoleEnum, Roles } from "src/constants/constants";
import { UserContext } from "src/types/user.types";

@Injectable()
export class CollaboratorService {
  constructor(
    @InjectRepository(Collaborator)
    private readonly collaboratorRepository: Repository<Collaborator>,
   
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
 

  async findAll(id: string) {
    const collaborators = await this.collaboratorRepository.find({
      where: { organization: { id } },
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
  async findOneByIdAndOrganizationId(id: string, org_id: string = "") {
    try {
      const collaborator = await this.collaboratorRepository.findOne({
        where: {
          user: {id},
          organization: {
            id: org_id,
            deleted_at: null,
          },
        },
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
}
