import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Role } from 'database/models/role.model';
import { User } from 'database/models/user.model';
import { Session } from 'express-session';
import { ROLES_CONSTANTS } from 'src/role/roles.constants';
import { SEQUELIZE_PROVIDERS_KEYS } from 'src/sequelize/sequelize.constants';
import { IUserDetails } from 'src/user/interfaces/IUserDetails';
import { EMAIL_USER_KEY } from 'src/user/constants/users.constants';
import { UserKeys, UserValues } from 'src/user/user.types';
import { AUTH_RESPONSE_MESSAGES } from './auth-response.messages';
import {
  LOGS_ACTIONS_CONSTANTS,
  LOGS_ENTITIES_CONSTANTS,
} from 'src/logger/constants/logger.constants';
import LogsService from 'src/logger/logger.service';

@Injectable()
class AuthService {
  constructor(
    @Inject(SEQUELIZE_PROVIDERS_KEYS.USERS_REPOSITORY)
    private usersRepository: typeof User,
    @Inject(SEQUELIZE_PROVIDERS_KEYS.ROLES_REPOSITORY)
    private rolesRepository: typeof Role,
    private readonly logsService: LogsService,
  ) {}

  async findUserByKey(key: UserKeys, value: UserValues): Promise<User> {
    return await this.usersRepository.findOne({
      where: { [key]: value },
      include: {
        model: Role,
        attributes: ['value'],
      },
    });
  }

  private async createNewUser(userDetails: IUserDetails): Promise<void> {
    const newUser = await this.usersRepository.create({
      id: undefined,
      email: userDetails.email,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      birthdate: undefined,
      avatar: userDetails.avatar,
    });

    await this.logsService.createLog(
      LOGS_ACTIONS_CONSTANTS.CREATED,
      LOGS_ENTITIES_CONSTANTS.USER,
      newUser.id,
      newUser.id,
    );

    await this.rolesRepository.create({
      userId: newUser.id,
      value: ROLES_CONSTANTS.USER,
    });

    await this.logsService.createLog(
      LOGS_ACTIONS_CONSTANTS.CREATED,
      LOGS_ENTITIES_CONSTANTS.ROLE,
      newUser.id,
      newUser.id,
    );
  }

  async validateUser(userDetails: IUserDetails): Promise<User> {
    const user = await this.findUserByKey(EMAIL_USER_KEY, userDetails.email);

    if (!user) {
      await this.createNewUser(userDetails);
      return await this.findUserByKey(EMAIL_USER_KEY, userDetails.email);
    }

    return user;
  }

  logoutUser(session: Session): void {
    session.destroy((error) => {
      if (error)
        throw new InternalServerErrorException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: AUTH_RESPONSE_MESSAGES.LOGOUT_ERROR,
        });
    });
  }
}
export default AuthService;
