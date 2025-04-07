import { IsNumber } from 'class-validator';

export class HiddenPoints {
	@IsNumber()
	x_value: number;
	@IsNumber()
	y_value: number;
	@IsNumber()
	size: number;
}
