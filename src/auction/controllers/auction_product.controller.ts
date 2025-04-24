import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuctionService } from '../auction.service';
import { UpdateAuctionDto } from '../dto/update-auction.dto';
import { CreateProductAuctionDto } from '../dto/create-product.dto';

@Controller('auction/product')
export class AuctionProductController {
  constructor(private readonly auctionService: AuctionService) {}

  @Post()
  create(@Body() createAuctionDto: CreateProductAuctionDto) {
    return this.auctionService.createProduct(createAuctionDto);
  }

  @Get('all/:auctionId')
  findAll(@Param('auctionId') id: string) {
    return this.auctionService.findAllProducts(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.auctionService.findOneProduct(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionService.updateProduct(id, updateAuctionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auctionService.removeProduct(id);
  }
}
