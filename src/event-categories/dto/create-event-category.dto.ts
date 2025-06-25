import { IsNotEmpty, IsString } from "class-validator";

export class CreateEventCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
