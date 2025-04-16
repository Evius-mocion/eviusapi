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

	async findOne(id: string) {
		const networking = await this.networkingRepository.findOne({ where: { id } });
		if (!networking) {
			throw new NotFoundException(`Networking with ID ${id} not found`);
		}
		return networking;
	}

	async getByEventId(eventId: string) {
		const networking = await this.networkingRepository.findOne({
			where: { event: { id: eventId } },
		});

		if (!networking) {
			throw new NotFoundException(`No networking sessions found for event ID ${eventId}`);
		}

		return networking;
	}

	async update(id: string, updateNetworkingDto: UpdateNetworkingDto) {
		await this.canEditNetworking(id);

		const networking = await this.networkingRepository.preload({
			id,
			...updateNetworkingDto,
		});

		if (!networking) {
			throw new NotFoundException(`Networking with ID ${id} not found`);
		}

		const updatedNetworking = await this.networkingRepository.save(networking);

		return updatedNetworking;
	}
	async changeActive(id: string, active: boolean) {
		const networking = await this.findOne(id);

		networking.active = active;

		const updatedNetworking = await this.networkingRepository.save(networking);

		return updatedNetworking;
	}

	remove(id: string) {
		return `This action removes a #${id} networking`;
	}

	async canEditNetworking(networkingId: string) {
		const networking = await this.findOne(networkingId);
		if (networking.active) {
			throw new Error('Cannot edit an active networking session');
		}
		return true;
	}
}
