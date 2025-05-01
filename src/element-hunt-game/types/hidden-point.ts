import { IsNumber, IsUUID } from 'class-validator';

export class HiddenPoints {
	@IsUUID()
	id: string;
	
	@IsNumber()
	x_value: number;
	
	@IsNumber()
	y_value: number;
	
	@IsNumber()
	size: number;
}
