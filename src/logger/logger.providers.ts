import { Log } from 'database/models/log.model';
import { SEQUELIZE_PROVIDERS_KEYS } from 'src/sequelize/sequelize.constants';

export const loggerProviders = [
  {
    provide: SEQUELIZE_PROVIDERS_KEYS.LOGS_REPOSITORY,
    useValue: Log,
  },
];
