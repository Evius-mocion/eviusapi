import { Injectable } from '@nestjs/common';
import { CreateMillionaireDto } from './dto/create-millionaire.dto';
import { UpdateMillionaireDto } from './dto/update-millionaire.dto';

@Injectable()
export class MillionaireService {
  create(createMillionaireDto: CreateMillionaireDto) {
    return 'This action adds a new millionaire';
  }

  findAll() {
    return `This action returns all millionaire`;
  }

  findOne(id: number) {
    return `This action returns a #${id} millionaire`;
  }

  update(id: number, updateMillionaireDto: UpdateMillionaireDto) {
    return `This action updates a #${id} millionaire`;
  }

  remove(id: number) {
    return `This action removes a #${id} millionaire`;
  }
}
