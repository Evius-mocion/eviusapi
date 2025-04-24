import { IsEnum, IsString, IsUUID } from "class-validator";
import { auctionCurrencyEnum } from "../interfaces";

export class CreateAuctionDto {

    @IsString()
    name: string;

    @IsString()
    @IsEnum(auctionCurrencyEnum)
    currency: auctionCurrencyEnum;

    @IsString()
    rules: string;
    
    @IsUUID()
    event_id: string;

}   
