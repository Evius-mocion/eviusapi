import { Module } from '@nestjs/common';
import { MillionaireService } from './millionaire.service';
import { MillionaireController } from './millionaire.controller';

@Module({
  controllers: [MillionaireController],
  providers: [MillionaireService],
})
export class MillionaireModule {}
