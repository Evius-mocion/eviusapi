import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateNetworkingDto } from './dto/create-networking.dto';
import { UpdateNetworkingDto } from './dto/update-networking.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventService } from 'src/event/event.service';
import { Networking } from './entities/networking.entity';
import { meetingConfigInitial } from './constants/networking.constants';

@Injectable()
export class NetworkingService {
	constructor(
		@InjectRepository(Networking)
		private readonly networkingRepository: Repository<Networking>,
		private readonly eventService: EventService
	) {}

	async create(createNetworkingDto: CreateNetworkingDto) {
		await this.eventService.findOne(createNetworkingDto.eventId);

		const networkingExist = await this.networkingRepository.findOne({
			where: { event: { id: createNetworkingDto.eventId } },
		});

		if (networkingExist) {
			throw new BadRequestException('A networking already exists for this event');
		}

		const { meeting_config, ...rest } = createNetworkingDto;

		const networking = this.networkingRepository.create({
			...rest,
			event: { id: createNetworkingDto.eventId },
			meeting_config: { ...meetingConfigInitial, ...(meeting_config || {}) },
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
		console.log('1');
		await this.canEditNetworking(id);
		console.log('updateNetworkingDto', updateNetworkingDto);
		const { meeting_config, ...rest } = updateNetworkingDto;
		console.log('meeting_config', meeting_config);

		const currentNetworking = await this.findOne(id);
		console.log('currentNetworking', currentNetworking);

		const networking = await this.networkingRepository.preload({
			id,
			...rest,
			...(meeting_config && { meeting_config: { ...currentNetworking.meeting_config, ...meeting_config } }),
		});
		console.log('networking', networking);
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
			throw new BadRequestException('Cannot modify networking settings while session is active. Please deactivate the session first.');
		}
		return true;
	}
}
