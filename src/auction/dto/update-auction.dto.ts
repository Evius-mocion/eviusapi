import { PartialType } from '@nestjs/swagger';
import { CreateAuctionDto } from './create-auction.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {
    @IsString()
    @IsOptional()
    status?: string;
    
}
