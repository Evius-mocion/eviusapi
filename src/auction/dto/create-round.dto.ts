import { IsNotEmpty, IsNumber, IsDateString, IsUUID } from 'class-validator';

export class CreateRoundDto {

    @IsNotEmpty()
    @IsUUID()
    auction_id: string;
   
    @IsNotEmpty()
    @IsUUID()
    product_id: string;
}