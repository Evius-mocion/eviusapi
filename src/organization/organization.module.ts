import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { CollaboratorModule } from 'src/collaborator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { User } from 'src/common/entities';
import { inviteCollaborator } from 'src/collaborator/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Organization,User,inviteCollaborator]),CollaboratorModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
