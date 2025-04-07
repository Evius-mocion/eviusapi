import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { ElementHuntGameService } from './element-hunt-game.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateElementHuntGameDto } from './dto/create-element-hunt-game.dto';
import { UpdateElementHuntGameDto } from './dto/update-element-hunt-game.dto';

@ApiTags('element-hunt-games')
@Controller('element-hunt-games')
export class ElementHuntGameController {
  constructor(private readonly gameService: ElementHuntGameService) {}

  @Post()
  create(@Body() createDto: CreateElementHuntGameDto) {
    return this.gameService.create(createDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.gameService.findByEventId(eventId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateElementHuntGameDto) {
    return this.gameService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(id);
  }
}
