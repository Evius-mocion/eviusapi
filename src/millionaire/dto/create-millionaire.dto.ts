import { IsOptional, IsString } from "class-validator";

export class CreateMillionaireDto {
    // Define the properties needed for creating a Millionaire
    @IsString()
    name: string;
    
    
    @IsString()
    @IsOptional()
    rules: string;
    // Add other properties as needed
}