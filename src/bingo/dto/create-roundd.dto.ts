import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateBingoRoundDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsNumber()
    number: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsString()
    @IsOptional()
    bingoId?: string;

    @IsString()
    @IsOptional()
    winnerId?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    createdAt?: string;

    @IsString()
    @IsOptional()
    updatedAt?: string;
}
