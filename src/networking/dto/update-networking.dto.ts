import { PartialType } from '@nestjs/swagger';
import { CreateNetworkingDto } from './create-networking.dto';

export class UpdateNetworkingDto extends PartialType(CreateNetworkingDto) {}
