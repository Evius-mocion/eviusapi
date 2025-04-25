import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './controllers/auction.controller';
import { Auction } from './entities/auction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionRound } from './entities/auction_round.entity';
import { Bid } from './entities/bid.entity';
import { Product } from './entities/product.entity';
import { Event } from 'src/event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auction,AuctionRound,Bid,Product,Event])],
  controllers: [AuctionController],
  providers: [AuctionService],
})
export class AuctionModule {}
