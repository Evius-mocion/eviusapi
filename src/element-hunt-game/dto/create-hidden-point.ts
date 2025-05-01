import { IsNumber } from 'class-validator';

export class CreateHiddenPointDto {
	@IsNumber()
	x_value: number;

	@IsNumber()
	y_value: number;

	@IsNumber()
	size: number;
}
