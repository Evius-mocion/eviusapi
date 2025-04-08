import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { Public, SuperAdmin } from 'src/common/decorators';
import { PaginationArgs } from 'src/common/dto';
import { BingoCardService } from '../services/bingo-card.service';
import { CardDto } from '../dto/card.dto';
import { UpdateBingoDto } from '../dto/update-bingo.dto';

@Controller('bingo/cards')
export class BingoCardController {
  constructor(private readonly bingoCardService: BingoCardService) {}
  
  @Post('generate-cards')
  generateCards(
    @Body() cardDto: CardDto
  ) {
    return this.bingoCardService.generateCards(cardDto);
  }

  @Get(':id')
  getOneCard(
    @Param('id') id: string,
  ) {
    return this.bingoCardService.getOneCard(id);
  }

  @Get('all/:bingoId')
  getAllCards(
      @Param('bingoId') id: string,
      @Query() pagination: PaginationArgs,
  ) {
      return this.bingoCardService.getAllCards(id, pagination);
  }


  @Delete('all/:bingoId')
  deleteAllCards(@Param('id') id: string) {
      return this.bingoCardService.deleteAllCards(id);
  }

  @Post('status/:id')
  statusCard(
    @Param('id') id: string,
    @Body() update: UpdateBingoDto
  ) {
      return this.bingoCardService.changeStatusCard(id,update.status);
  }

}
