import { Module } from '@nestjs/common';
import { sequelizeProviders } from './sequelize.providers';

@Module({
  providers: [...sequelizeProviders],
  exports: [...sequelizeProviders],
})
export class SequelizeModule {}
