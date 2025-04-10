import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailTemplate } from './entities/template.entity';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { EventModule } from 'src/event';
import { Event } from 'src/event/entities/event.entity';

@Module({
	imports: [TypeOrmModule.forFeature([EmailTemplate, Event]),EventModule],
	controllers: [TemplateController],
	providers: [TemplateService],
})
export class TemplateModule {}
