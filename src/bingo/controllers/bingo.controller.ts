import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BingoService } from '../services/bingo.service';
import { CreateBingoDto } from '../dto/create-bingo.dto';
import { UpdateBingoDto } from '../dto/update-bingo.dto';
import { Public, SuperAdmin } from 'src/common/decorators';

@Controller('bingo')
export class BingoController {
  constructor(private readonly bingoService: BingoService) {}

  @Post()
  create(@Body() createBingoDto: CreateBingoDto) {
    return this.bingoService.create(createBingoDto);
  }

  @Get("all/:eventId")
  findAll(@Param('eventId') eventId: string) {
    return this.bingoService.findAll(eventId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bingoService.findOne(id);
  }

  @Get('activity/:id')
  findOneByActivity(
    @Param('id') id: string,
    @Query('attendeeId') attendeeId: string
  ) {
    return this.bingoService.findOneByActivity(id,attendeeId);
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

}
