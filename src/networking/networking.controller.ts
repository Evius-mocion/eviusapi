import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe } from '@nestjs/common';
import { NetworkingService } from './networking.service';
import { CreateNetworkingDto } from './dto/create-networking.dto';
import { UpdateNetworkingDto } from './dto/update-networking.dto';

@Controller('networking')
export class NetworkingController {
	constructor(private readonly networkingService: NetworkingService) {}

	@Post()
	async create(@Body() createNetworkingDto: CreateNetworkingDto) {
		const networking = await this.networkingService.create(createNetworkingDto);
		return { networking };
	}

	@Get('byEvent/:eventId')
	async findOneByEvent(@Param('eventId', new ParseUUIDPipe()) eventId: string) {
		const networking = await this.networkingService.getByEventId(eventId);
		return { networking };
	}

	@Patch(':id')
	async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateNetworkingDto: UpdateNetworkingDto) {
		const networking = await this.networkingService.update(id, updateNetworkingDto);
		return { networking };
	}

	@Patch('changeStatus/:id')
	async changeActive(@Param('id', new ParseUUIDPipe()) id: string, @Body() body: { active: boolean }) {
		const networking = await this.networkingService.changeActive(id, body.active);
		return { networking };
	}
}
