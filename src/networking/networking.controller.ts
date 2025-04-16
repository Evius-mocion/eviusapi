import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { NetworkingService } from './networking.service';
import { CreateNetworkingDto } from './dto/create-networking.dto';
import { UpdateNetworkingDto } from './dto/update-networking.dto';

@Controller('networking')
export class NetworkingController {
	constructor(private readonly networkingService: NetworkingService) {}

	@Post()
	create(@Body() createNetworkingDto: CreateNetworkingDto) {
		return this.networkingService.create(createNetworkingDto);
	}

	@Get()
	findAll() {
		return this.networkingService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.networkingService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateNetworkingDto: UpdateNetworkingDto) {
		return this.networkingService.update(id, updateNetworkingDto);
	}

	@Delete(':id')
	remove(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.networkingService.remove(id);
	}
}
