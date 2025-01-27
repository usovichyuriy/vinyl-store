import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Review } from 'database/models/review.model';
import { Vinyl } from 'database/models/vinyl.model';
import { CreateReviewDto } from 'src/review/create-review.dto';
import { VINYL_RESPONSE_MESSAGES } from 'src/vinyl/vinyl-response.messages';
import { REVIEW_RESPONSE_MESSAGES } from './review-response.messages';
import { IPaginationOptions } from 'src/pagination/IPaginationOptions';
import { PAGINATION_CONSTANTS } from 'src/pagination/pagination.constants';
import { SEQUELIZE_PROVIDERS_KEYS } from 'src/sequelize/sequelize.constants';
import LoggerService from 'src/logger/logger.service';
import {
  LOGS_ACTIONS_CONSTANTS,
  LOGS_ENTITIES_CONSTANTS,
} from 'src/logger/constants/logger.constants';

@Injectable()
class ReviewService {
  constructor(
    @Inject(SEQUELIZE_PROVIDERS_KEYS.VINYLS_REPOSITORY)
    private vinylsRepository: typeof Vinyl,
    @Inject(SEQUELIZE_PROVIDERS_KEYS.REVIEWS_REPOSITORY)
    private reviewsRepository: typeof Review,
    private readonly logsService: LoggerService,
  ) {}

  async addReview(
    vinylId: number,
    body: CreateReviewDto,
    userId: number,
  ): Promise<Review> {
    const vinyl = await this.vinylsRepository.findOne({
      where: { id: vinylId },
    });

    if (!vinyl) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: VINYL_RESPONSE_MESSAGES.VINYL_NOT_FOUND,
      });
    }

    const reviewDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const review = await this.reviewsRepository.create({
      id: undefined,
      userId,
      vinylId,
      description: body.description,
      reviewDate,
      rating: body.rating,
    });

    await this.logsService.createLog(
      LOGS_ACTIONS_CONSTANTS.CREATED,
      LOGS_ENTITIES_CONSTANTS.REVIEW,
      review.id,
      userId,
    );

    return review;
  }

  async removeReview(id: number, userId: number): Promise<void> {
    const review = await this.reviewsRepository.findOne({ where: { id } });

    if (!review) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: REVIEW_RESPONSE_MESSAGES.REVIEW_NOT_FOUND,
      });
    }

    await this.reviewsRepository.destroy({ where: { id } });

    await this.logsService.createLog(
      LOGS_ACTIONS_CONSTANTS.DELETED,
      LOGS_ENTITIES_CONSTANTS.REVIEW,
      id,
      userId,
    );
  }

  async getAllReviewsForVinyl(
    vinylId: number,
    paginationOptions?: IPaginationOptions,
  ): Promise<Review[]> {
    const limit: number =
      paginationOptions && paginationOptions.limit
        ? parseInt(paginationOptions.limit)
        : PAGINATION_CONSTANTS.LIMIT;
    const offset: number =
      paginationOptions && paginationOptions.offset
        ? parseInt(paginationOptions.offset)
        : PAGINATION_CONSTANTS.OFFSET;

    return await this.reviewsRepository.findAll({
      where: { vinylId },
      limit,
      offset,
    });
  }
}
export default ReviewService;
