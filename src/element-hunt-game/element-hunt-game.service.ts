import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElementHuntGame } from './entities/element-hunt-game.entity';
import { CreateElementHuntGameDto } from './dto/create-element-hunt-game.dto';
import { UpdateElementHuntGameDto } from './dto/update-element-hunt-game.dto';

@Injectable()
export class ElementHuntGameService {
  constructor(
    @InjectRepository(ElementHuntGame)
    private readonly gameRepository: Repository<ElementHuntGame>,
  ) {}

  async create(createDto: CreateElementHuntGameDto) {
    const game = this.gameRepository.create(createDto);
    return await this.gameRepository.save(game);
  }

  async findOne(id: string) {
    return await this.gameRepository.findOneBy({ id });
  }

  async findByEventId(eventId: string) {
    return await this.gameRepository.findOne({
      where: { event: { id: eventId } },
      relations: ['event']
    });
  }

  async update(id: string, updateDto: UpdateElementHuntGameDto) {
    await this.gameRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.gameRepository.delete(id);
    return { deleted: true };
  }
}
