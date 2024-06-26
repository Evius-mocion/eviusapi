import { Module } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { Assistant } from './entities/assistant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assistant,User])],
  controllers: [AssistantController],
  providers: [AssistantService],
  exports: [AssistantService]
})
export class AssistantModule {}
