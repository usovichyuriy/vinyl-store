import { Log } from 'database/models/log.model';
import { Purchase } from 'database/models/purchase.model';
import { Vinyl } from 'database/models/vinyl.model';
import { SEQUELIZE_PROVIDERS_KEYS } from 'src/sequelize/sequelize.constants';

export const vinylProviders = [
  {
    provide: SEQUELIZE_PROVIDERS_KEYS.VINYLS_REPOSITORY,
    useValue: Vinyl,
  },
  {
    provide: SEQUELIZE_PROVIDERS_KEYS.PURCHASES_REPOSITORY,
    useValue: Purchase,
  },
  {
    provide: SEQUELIZE_PROVIDERS_KEYS.LOGS_REPOSITORY,
    useValue: Log,
  },
];
