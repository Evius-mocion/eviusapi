import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common'
import { CreateBingoRoundDto } from '../dto/create-roundd.dto';
import { BingoRoundService } from '../services/bingo-round.service';
import { CreateBingoHistoryDto } from '../dto/create-bingo-history.dto';

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

  @Post('validate-card')
  validateCard(@Body() body: any) {
    const {  cardId, cardCode,  roundId } = body;
    return this.bingoRoundService.validateCard(cardId,cardCode, roundId);
  }

    
    @Post('history')
    createHistory(@Body() createHistoryDto: CreateBingoHistoryDto) {
        return this.bingoRoundService.createHistory(createHistoryDto);
    }
}
