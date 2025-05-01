import { IsString, IsNotEmpty, IsOptional, IsUUID, IsObject } from 'class-validator';
import { IBoxStyle } from '../interfaces';

export class CreateBingoDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsNotEmpty()
    type: string;


    @IsString()
    @IsOptional()
    banner?: string;

    @IsString()
    @IsOptional()
    footer?: string;

    @IsString()
    @IsOptional()
    background_color?: string;

    @IsString()
    @IsOptional()
    background_image?: string;

    @IsString()
    @IsOptional()
    brands?: string;

    @IsObject()
    @IsOptional()
    box_styles?: IBoxStyle;

    @IsUUID()
    eventId: string;
}
