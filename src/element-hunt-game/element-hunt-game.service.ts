import { Injectable } from '@nestjs/common';
import { CreateElementHuntGameDto } from './dto/create-element-hunt-game.dto';
import { UpdateElementHuntGameDto } from './dto/update-element-hunt-game.dto';

@Injectable()
export class ElementHuntGameService {
  create(createElementHuntGameDto: CreateElementHuntGameDto) {
    return 'This action adds a new elementHuntGame';
  }

  findAll() {
    return `This action returns all elementHuntGame`;
  }

  findOne(id: number) {
    return `This action returns a #${id} elementHuntGame`;
  }

  update(id: number, updateElementHuntGameDto: UpdateElementHuntGameDto) {
    return `This action updates a #${id} elementHuntGame`;
  }

  remove(id: number) {
    return `This action removes a #${id} elementHuntGame`;
  }
}
