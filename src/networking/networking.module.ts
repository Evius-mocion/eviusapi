import { Module } from '@nestjs/common';
import { NetworkingService } from './networking.service';
import { NetworkingController } from './networking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Networking } from './entities/networking.entity';
import { EventModule } from 'src/event/event.module';

@Module({
	imports: [TypeOrmModule.forFeature([Networking]), EventModule],
	controllers: [NetworkingController],
	providers: [NetworkingService],
})
export class NetworkingModule {}
