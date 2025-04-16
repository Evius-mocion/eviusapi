import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNetworkingDto } from './dto/create-networking.dto';
import { UpdateNetworkingDto } from './dto/update-networking.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventService } from 'src/event/event.service';
import { Networking } from './entities/networking.entity';

@Injectable()
export class NetworkingService {
	constructor(
		@InjectRepository(Networking)
		private readonly networkingRepository: Repository<Networking>,
		private readonly eventService: EventService
	) {}
	async create(createNetworkingDto: CreateNetworkingDto) {
		await this.eventService.findOne(createNetworkingDto.eventId);

		const networking = this.networkingRepository.create({
			...createNetworkingDto,
			event: { id: createNetworkingDto.eventId },
		});

		const savedNetworking = await this.networkingRepository.save(networking);

		return savedNetworking;
	}

	findAll() {}

	async findOne(id: string) {
		const networking = await this.networkingRepository.findOne({ where: { id } });
		if (!networking) {
			throw new NotFoundException(`Networking with ID ${id} not found`);
		}
		return networking;
	}

	update(id: string, updateNetworkingDto: UpdateNetworkingDto) {
		return `This action updates a #${id} networking`;
	}

	remove(id: string) {
		return `This action removes a #${id} networking`;
	}
}
