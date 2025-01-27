import { Log } from 'database/models/log.model';
import { Review } from 'database/models/review.model';
import { Role } from 'database/models/role.model';
import { User } from 'database/models/user.model';
import { SEQUELIZE_PROVIDERS_KEYS } from 'src/sequelize/sequelize.constants';

export const userProviders = [
  {
    provide: SEQUELIZE_PROVIDERS_KEYS.USERS_REPOSITORY,
    useValue: User,
  },
  {
    provide: SEQUELIZE_PROVIDERS_KEYS.ROLES_REPOSITORY,
    useValue: Role,
  },
  {
    provide: SEQUELIZE_PROVIDERS_KEYS.REVIEWS_REPOSITORY,
    useValue: Review,
  },
  {
    provide: SEQUELIZE_PROVIDERS_KEYS.LOGS_REPOSITORY,
    useValue: Log,
  },
];
