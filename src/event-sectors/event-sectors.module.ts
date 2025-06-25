import { Module } from '@nestjs/common';
import { EventSectorsService } from './event-sectors.service';
import { EventSectorsController } from './event-sectors.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { EventSector } from './entities/event-sector.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventSector]),
  ],
  controllers: [EventSectorsController],
  providers: [EventSectorsService],
})
export class EventSectorsModule {}
