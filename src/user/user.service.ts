import { HttpStatus, Inject, NotFoundException } from '@nestjs/common';
import { Purchase } from 'database/models/purchase.model';
import { Review } from 'database/models/review.model';
import { User } from 'database/models/user.model';
import { IUserProfile } from './interfaces/IUserProfile';
import { UpdateProfileDto } from 'src/user/update-profile.dto';
import { USER_RESPONSE_MESSAGES } from './constants/user-response.messages';
import { SEQUELIZE_PROVIDERS_KEYS } from 'src/sequelize/sequelize.constants';
import {
  ALL_ENTRIES_ID,
  LOGS_ACTIONS_CONSTANTS,
  LOGS_ENTITIES_CONSTANTS,
} from 'src/logger/constants/logger.constants';
import LoggerService from 'src/logger/logger.service';
import { Role } from 'database/models/role.model';

class UserService {
  constructor(
    @Inject(SEQUELIZE_PROVIDERS_KEYS.USERS_REPOSITORY)
    private usersRepository: typeof User,
    @Inject(SEQUELIZE_PROVIDERS_KEYS.ROLES_REPOSITORY)
    private rolesRepository: typeof Role,
    @Inject(SEQUELIZE_PROVIDERS_KEYS.REVIEWS_REPOSITORY)
    private reviewsRepository: typeof Review,
    private readonly logsService: LoggerService,
  ) {}

  async getMyProfile(id: number): Promise<IUserProfile> {
    const userData = await this.usersRepository.findOne({
      where: { id },
      include: [
        {
          model: Review,
        },
        {
          model: Purchase,
        },
      ],
    });

    if (!userData) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: USER_RESPONSE_MESSAGES.PROFILE_NOT_FOUND,
      });
    }

    const userProfile: IUserProfile = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      birthdate: userData.birthdate,
      avatar: userData.avatar,
      reviews: userData.reviews,
      purchases: userData.purchases,
    };
    return userProfile;
  }

  private async changeProfileData(
    user: User,
    body: UpdateProfileDto,
  ): Promise<void> {
    for (const [key, value] of Object.entries(body)) {
      if (value != null) await user.update({ [key]: value });
    }
  }

  async editMyProfile(id: number, body: UpdateProfileDto): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: USER_RESPONSE_MESSAGES.PROFILE_NOT_FOUND,
      });
    }

    await this.changeProfileData(user, body);

    await this.logsService.createLog(
      LOGS_ACTIONS_CONSTANTS.UPDATED,
      LOGS_ENTITIES_CONSTANTS.USER,
      id,
      id,
    );
  }

  async deleteMyProfile(id: number): Promise<void> {
    const profile = await this.usersRepository.findOne({ where: { id } });

    if (!profile) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: USER_RESPONSE_MESSAGES.PROFILE_NOT_FOUND,
      });
    }

    await this.usersRepository.destroy({ where: { id } });

    await this.logsService.createLog(
      LOGS_ACTIONS_CONSTANTS.DELETED,
      LOGS_ENTITIES_CONSTANTS.USER,
      id,
      id,
    );

    await this.rolesRepository.destroy({ where: { userId: id } });

    await this.logsService.createLog(
      LOGS_ACTIONS_CONSTANTS.DELETED,
      LOGS_ENTITIES_CONSTANTS.ROLE,
      id,
      id,
    );

    await this.reviewsRepository.destroy({ where: { userId: id } });

    await this.logsService.createLog(
      LOGS_ACTIONS_CONSTANTS.DELETED,
      LOGS_ENTITIES_CONSTANTS.REVIEW,
      ALL_ENTRIES_ID,
      id,
    );
  }
}
export default UserService;
