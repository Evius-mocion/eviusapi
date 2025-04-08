import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BingoService } from './bingo.service';
import { CreateBingoDto } from './dto/create-bingo.dto';
import { UpdateBingoDto } from './dto/update-bingo.dto';
import { Public, SuperAdmin } from 'src/common/decorators';
import { CardDto } from './dto/card.dto';
import { PaginationArgs } from 'src/common/dto';

@Controller('bingo')
export class BingoController {
  constructor(private readonly bingoService: BingoService) {}

  @Public()
  @Post()
  create(@Body() createBingoDto: CreateBingoDto) {
    return this.bingoService.create(createBingoDto);
  }

  @Get("all")
  findAll() {
    return this.bingoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bingoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBingoDto: UpdateBingoDto) {
    return this.bingoService.update(id, updateBingoDto);
  }

  @SuperAdmin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bingoService.remove(id);
  }

  @Post(':id/generate-ballots')
  generateBallots(
    @Param('id') id: string,
    @Query('amount') amount: number) {
    return this.bingoService.generateBallots(id,amount);
  }

  //////// bingo cards endpoints
  
  @Post(':id/generate-cards')
  generateCards(
    @Param('id') id: string,
    @Body() cardDto: CardDto
  ) {
    return this.bingoService.generateCards(id, cardDto);
  }

  @Get('cards/:id')
  getOneCard(
    @Param('id') id: string,
  ) {
    return this.bingoService.getOneCard(id);
  }

  @Public()
  @Get(':id/cards')
  getAllCards(
      @Param('id') id: string,
      @Query() pagination: PaginationArgs,
  ) {
      return this.bingoService.getAllCards(id, pagination);
  }


  @Delete(':id/cards')
  deleteAllCards(@Param('id') id: string) {
      return this.bingoService.deleteAllCards(id);
  }

  @Post('cards/status/:id')
  statusCard(
    @Param('id') id: string,
    @Body() update: UpdateBingoDto
  ) {
      return this.bingoService.changeStatusCard(id,update.status);
  }



  @Public()
  @Post(':id/create-round')
  createRound(
    @Param('id') id: string,
    @Body() cardDto: CardDto
  ) {
    return this.bingoService.generateCards(id, cardDto);
  }

}
