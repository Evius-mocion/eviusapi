import { Injectable } from '@nestjs/common';
import { CreateBingoDto } from './dto/create-bingo.dto';
import { UpdateBingoDto } from './dto/update-bingo.dto';

@Injectable()
export class BingoService {
  create(createBingoDto: CreateBingoDto) {
    return 'This action adds a new bingo';
  }

  findAll() {
    return `This action returns all bingo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bingo`;
  }

  update(id: number, updateBingoDto: UpdateBingoDto) {
    return `This action updates a #${id} bingo`;
  }

  remove(id: number) {
    return `This action removes a #${id} bingo`;
  }
}
