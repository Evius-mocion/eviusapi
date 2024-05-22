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
    private readonly colaboratorrRepository: Repository<Collaborator>,
  ) {}
  async create(createColaboratorDto: CreateCollaboratorDto) {
    try {
      const Colaborator =
        this.colaboratorrRepository.create(createColaboratorDto);

      return this.colaboratorrRepository.save(Colaborator);
    } catch (error) {}
  }

  findAll() {
    return `This action returns all colaborator`;
  }

  async findOneById(id: string) {
    try {
      return this.colaboratorrRepository.findOneBy({user_id: id})
    } catch (error) {
      return null
    }
  }

  update(id: number, updateColaboratorDto: UpdateCollaboratorDto) {
    return `This action updates a #${id} colaborator`;
  }

  remove(id: number) {
    return `This action removes a #${id} colaborator`;
  }
}
