import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuctionService } from '../auction.service';
import { CreateAuctionDto } from '../dto/create-auction.dto';
import { UpdateAuctionDto } from '../dto/update-auction.dto';

@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionService.create(createAuctionDto);
  }

  @Get('all/:eventId')
  findAll(@Param('eventId') id: string) {
    return this.auctionService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionService.update(id, updateAuctionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auctionService.remove(id);
  }
}
