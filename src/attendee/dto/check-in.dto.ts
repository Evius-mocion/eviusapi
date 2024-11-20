import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { CheckInType } from 'src/types/attendee.type';

export class checkInDto {
	@Transform(({ value }) => value.trim())
	@IsUUID()
	@IsOptional()
	stationID?: string;

	@IsString()
	@IsIn([CheckInType.STATION, CheckInType.CMS, CheckInType.LANDING])
	@IsOptional()
	type?: CheckInType;

	@IsString()
	@IsNotEmpty()
	date: string;
}
