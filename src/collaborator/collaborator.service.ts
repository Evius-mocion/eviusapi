import { Injectable } from "@nestjs/common";
import { CreateCollaboratorDto } from "./dto/create-collaborator.dto";
import { UpdateCollaboratorDto } from "./dto/update-collaborator.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Collaborator } from "./entities/collaborator.entity";

@Injectable()
export class CollaboratorService {
  constructor(
    @InjectRepository(Collaborator)
    private readonly collaboratorRepository: Repository<Collaborator>,
  ) {}
  async create(createCollaboratorDto: CreateCollaboratorDto) {
    try {
      const Collaborator = this.collaboratorRepository.create(createCollaboratorDto);

      return this.collaboratorRepository.save(Collaborator);
    } catch (error) {}
  }

  findAll() {
    return `This action returns all collaborator`;
  }

 async  findAllByUserID(user_id: string) {
    return this.collaboratorRepository.find({
      where: {
        user_id
      },
      relations: ['organization']
    })
  }

  async findOneById(id: string) {
    try {
      return this.collaboratorRepository.findOneBy({user_id: id})
    } catch (error) {
      return null
    }
  }
  async findOneByIdAndOrganizationId(id: string,org_id: string = "")  {
    try {
      const collaborator =  await this.collaboratorRepository.findOne({
        where: {
          user_id: id,
          organization: {
            id: org_id
          }
        }
      
      })
      return collaborator
    } catch (error) {
      return null
    }
  }

  update(id: number, updateCollaboratorDto: UpdateCollaboratorDto) {
    return `This action updates a #${id} collaborator`;
  }

  remove(id: number) {
    return `This action removes a #${id} collaborator`;
  }
}
