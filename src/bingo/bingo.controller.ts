import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BingoService } from './bingo.service';
import { CreateBingoDto } from './dto/create-bingo.dto';
import { UpdateBingoDto } from './dto/update-bingo.dto';

@Controller('bingo')
export class BingoController {
  constructor(private readonly bingoService: BingoService) {}

  @Post()
  create(@Body() createBingoDto: CreateBingoDto) {
    return this.bingoService.create(createBingoDto);
  }

  @Get()
  findAll() {
    return this.bingoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bingoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBingoDto: UpdateBingoDto) {
    return this.bingoService.update(+id, updateBingoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bingoService.remove(+id);
  }
}
