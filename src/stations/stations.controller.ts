import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { ActiveUser, SuperAdmin } from 'src/common/decorators';
import { UserContext } from 'src/types/user.types';

@Controller('stations')
export class StationsController {
	constructor(private readonly stationsService: StationsService) {}

	@SuperAdmin()
	@Post()
	create(@Body() createStationDto: CreateStationDto) {
		return this.stationsService.create(createStationDto);
	}

	@Get(':eventId')
	findAll(@Param('eventId') eventId: string) {
		return this.stationsService.findAll(eventId);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.stationsService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateStationDto: UpdateStationDto) {
		return this.stationsService.update(id, updateStationDto);
	}
	@SuperAdmin()
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.stationsService.remove(id);
	}
	
	@Get('getQR/:stationId')
	getQr(@Param('stationId') stationId: string, @ActiveUser() user: UserContext) {
		return this.stationsService.getQR(stationId, user.id);
	}
}
