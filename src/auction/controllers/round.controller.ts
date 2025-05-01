import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuctionService } from '../auction.service';
import { CreateRoundDto } from '../dto/create-round.dto';
import { UpdateRoundAuctionDto } from '../dto/update-round.dto';

@Controller('auction/round')
export class AuctionRoundController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  create(@Body() createRoundDto: CreateRoundDto) {
    return this.auctionService.createRound(createRoundDto);
  }

  @Get('all/:auctionId')
  findAll(@Param('auctionId') auctionId: string) {
    return this.auctionService.findAllRounds(auctionId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionService.findOneRound(id);
  }

  //mover al realtime/socket
  @Get('active/:auctionId')
  findOneActive(@Param('auctionId') id: string) {
    return this.auctionService.findOneRoundActive(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoundDto: UpdateRoundAuctionDto) {
    return this.auctionService.updateRound(id, updateRoundDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auctionService.removeRound(id);
  }
}