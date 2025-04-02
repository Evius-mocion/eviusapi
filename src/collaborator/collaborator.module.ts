import { Module } from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { CollaboratorController } from './collaborator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collaborator, inviteCollaborator } from './entities';
import { User } from 'src/common/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Collaborator,inviteCollaborator,User,Event])],
  controllers: [CollaboratorController],
  providers: [CollaboratorService],
  exports: [CollaboratorService],
})
export class CollaboratorModule {}
