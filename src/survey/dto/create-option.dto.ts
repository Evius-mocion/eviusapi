import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOptionDto {
  @ApiProperty({ description: 'ID of the question this option belongs to' })
  @IsUUID()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ example: 'Option text', description: 'The actual option value' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: 'Marks if this option is correct', default: false })
  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;
}