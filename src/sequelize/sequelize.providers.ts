import { Purchase } from 'database/models/purchase.model';
import { Review } from 'database/models/review.model';
import { Role } from 'database/models/role.model';
import { User } from 'database/models/user.model';
import { Vinyl } from 'database/models/vinyl.model';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE_PROVIDERS_KEYS } from './sequelize.constants';
import { ConfigService } from '@nestjs/config';
import { Log } from 'database/models/log.model';

export const sequelizeProviders = [
  {
    provide: SEQUELIZE_PROVIDERS_KEYS.SEQUELIZE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        define: {
          timestamps: false,
        },
      });
      sequelize.addModels([Vinyl, User, Review, Purchase, Role, Log]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
