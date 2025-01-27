import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role/roles.guard';

export const appProviders = [
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
];
