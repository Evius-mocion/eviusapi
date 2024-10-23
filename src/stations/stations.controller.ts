import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { Public, SuperAdmin } from 'src/common/decorators';

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
		return this.stationsService.findOne(+id);
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

	@Public()
	@Get('getQR/:stationId')
	getQr(@Param('stationId') stationId: string) {
		return this.stationsService.getQR(stationId);
	}

	@Public()
	@Get('stationLogin/:id')
	stationLogin(@Param('id') id: string) {
		console.log('id', id);
		return this.stationsService.stationLogin(id);
	}

	@Public()
	@Get('revalidateToken/:token')
	revalidateToken(@Param('token') token: string) {
		return this.stationsService.revalidateToken(token);
	}
}
