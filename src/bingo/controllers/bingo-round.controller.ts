import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { Public, SuperAdmin } from 'src/common/decorators';
import { BingoCardService } from '../services/bingo-card.service';
import { CardDto } from '../dto/card.dto';
@Controller('bingo/cards')
export class BingoRoundController {
  constructor(private readonly bingoCardService: BingoCardService) {}
  
    
  @Public()
  @Post(':id/create-round')
  createRound(
    @Param('id') id: string,
    @Body() cardDto: CardDto
  ) {
    return "" 
  }
}
