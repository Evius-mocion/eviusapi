// src/events/dto/find-events-query.dto.ts
import { IsOptional, IsString, Matches } from 'class-validator';

export class FindEventsQueryDto {
  @IsOptional()
  @IsString()
  orgName?: string;

  @IsOptional()
  @IsString()
  eventName?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'The date must be in the format YYYY-MM-DD'
  })
  date?: string;
}