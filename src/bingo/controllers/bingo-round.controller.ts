import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common'
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
  
}
