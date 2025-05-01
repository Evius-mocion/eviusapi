import {  IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateProductAuctionDto {

    @IsUUID()
    @IsString()
    auction_id: string;

    @IsString()
    name: string;

    @IsString()
    description: string;
    
    @IsString()
    @IsOptional()
    image: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsNumber()
    @IsPositive()
    increment: number;
    
}   
