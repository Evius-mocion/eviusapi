import { SetMetadata } from '@nestjs/common';

export const WITHOUT_ACCOUNT = 'withoutAccount';
export const WithoutAccount = () => SetMetadata(WITHOUT_ACCOUNT, true);