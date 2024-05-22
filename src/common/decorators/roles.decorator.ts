import { SetMetadata } from '@nestjs/common';
import { RoleType } from 'src/types/collaborator.types';

export const ROLES_KEY = 'role';
export const Role = (role: RoleType) => SetMetadata(ROLES_KEY, role);