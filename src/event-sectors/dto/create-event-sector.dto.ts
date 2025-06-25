import { IsNotEmpty, IsString } from "class-validator";

export class CreateEventSectorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
