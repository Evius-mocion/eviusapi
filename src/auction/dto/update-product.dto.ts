import { PartialType } from '@nestjs/swagger';
import { CreateProductAuctionDto } from './create-product.dto';

export class UpdateProductAuctionDto extends PartialType(CreateProductAuctionDto) {
    
}
