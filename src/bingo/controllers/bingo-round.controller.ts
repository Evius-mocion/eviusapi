import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { CreateBingoRoundDto } from '../dto/create-roundd.dto';
import { BingoRoundService } from '../services/bingo-round.service';
@Controller('bingo/round')
export class BingoRoundController {
  constructor(private readonly bingoRoundService: BingoRoundService) {}
  
    
  @Post('create')
  createRound(
    @Body() roundDto: CreateBingoRoundDto
  ) {
    return this.bingoRoundService.create(roundDto)
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bingoRoundService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bingoRoundService.remove(id);
  }
}
