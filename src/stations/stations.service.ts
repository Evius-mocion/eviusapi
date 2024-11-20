import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { Station } from './entities/station.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventService } from 'src/event';
import { ExperiencesService } from 'src/experiences/experiences.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StationsService {
	constructor(
		@InjectRepository(Station)
		private readonly stationRepository: Repository<Station>,
		private readonly eventService: EventService,
		private readonly experiencesService: ExperiencesService,
		private readonly jwtService: JwtService
	) {}

	async create(createStationDto: CreateStationDto) {
		const { eventId, experienceId, ...stationFields } = createStationDto;

		const event = await this.eventService.findOneBy(eventId);

		if (!event) {
			throw new NotFoundException('event not found');
		}

		const newstation = this.stationRepository.create({
			event: event,
			type: experienceId ? 'experience' : 'station',
			...stationFields,
		});

		if (experienceId) {
			const exp = await this.experiencesService.findById(experienceId);

			if (!exp) throw new NotFoundException('experience not found');

			newstation.experience = exp;
		}

		return this.stationRepository.save(newstation);
	}

	async findAll(eventId: string) {
		try {
			return this.stationRepository.find({
				where: {
					event: {
						id: eventId,
					},
				},
			});
		} catch (error) {
			throw new InternalServerErrorException('error fetching stations');
		}
	}

	async findOne(id: string) {
		return this.stationRepository.findOneBy({ id });
	}

	async update(id: string, updateStationDto: UpdateStationDto) {
		const { experienceId, ...othersFields } = updateStationDto;
		const station = await this.stationRepository.findOneBy({ id });

		if (!station) {
			throw new NotFoundException('station not found');
		}
		if (experienceId) {
			const exp = await this.experiencesService.findById(experienceId);

			if (!exp) throw new NotFoundException('experience not found');

			station.experience = exp;
		}

		const updateStation = {
			...station,
			...othersFields,
			experienceId,
		};
		return this.stationRepository.save(updateStation);
	}

	async remove(id: string) {
		const data = await this.stationRepository.delete(id);
		if (data.affected === 0) {
			throw new BadRequestException('station not found');
		}
		return { message: 'station deleted' };
	}
	async getQR(stationId: string, userId: string) {
		const station = await this.stationRepository.findOne({ where: { id: stationId }, relations: ['event'] });

		if (!station) {
			throw new NotFoundException('Station not found');
		}
		const generatedAt = new Date();

		const qrToken = this.jwtService.sign(
			{
				id: station.id,
				userId,
			},
			{ expiresIn: '1h' }
		);

		return { qrToken, generatedAt: generatedAt.toISOString() };
	}

	decryptToken = async (token: string) => {
		try {
			return await this.jwtService.verifyAsync(token, {
				secret: process.env.JWT_SECRET,
			});
		} catch (error) {
			throw new UnauthorizedException('Invalid token');
		}
	};
}
