import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

export function handleTypeOrmError(error: any): never {
	if (error && error.code) {
		switch (error.code) {
			case '23505': // unique_violation
				throw new ConflictException('Duplicate entry');
			case '23503': // foreign_key_violation
				throw new BadRequestException('Invalid foreign key');
			case '23502': // not_null_violation
				throw new BadRequestException('Missing required field');
			case '23514': // check_violation
				throw new BadRequestException('Check constraint violation');
			case '22001': // string_data_right_truncation
				throw new BadRequestException('Value too long for column');
			case '22003': // numeric_value_out_of_range
				throw new BadRequestException('Numeric value out of range');
			case '22007': // invalid_datetime_format
				throw new BadRequestException('Invalid datetime format');
			case '22008': // datetime_field_overflow
				throw new BadRequestException('Datetime field overflow');
			case '22P02': // invalid_text_representation
				throw new BadRequestException('Invalid input syntax');
			case '40001': // serialization_failure
				throw new ConflictException('Serialization failure');
			case '40P01': // deadlock_detected
				throw new ConflictException('Deadlock detected');
			case '404':
				throw new NotFoundException('Entity not found');
			default:
				throw new BadRequestException(error.message || 'Database error');
		}
	}
	throw new InternalServerErrorException(error.message || 'Unexpected database error');
}
