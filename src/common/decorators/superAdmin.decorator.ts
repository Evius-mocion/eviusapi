import { SetMetadata } from '@nestjs/common';

export const SUPER_ADMIN = 'SUPER_ADMIN';
export const SuperAdmin = () => SetMetadata(SUPER_ADMIN, true);