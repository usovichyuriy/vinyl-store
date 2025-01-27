import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Vinyl } from 'database/models/vinyl.model';
import { QueryTypes } from 'sequelize';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { IVinylsQueryResponse } from './interfaces/IVinylsQueryResponse';
import { IPaginationOptions } from 'src/pagination/IPaginationOptions';
import { PAGINATION_CONSTANTS } from '../pagination/pagination.constants';
import { VINYL_RESPONSE_MESSAGES } from './vinyl-response.messages';
import { IVinyl } from './interfaces/IVinyl';
import StripeService from 'src/stripe/stripe.service';
import { ISortOptions } from './interfaces/ISortOptions';
import { ISearchOptions } from './interfaces/ISearchOptions';
import { SEQUELIZE_PROVIDERS_KEYS } from 'src/sequelize/sequelize.constants';
import { Purchase } from 'database/models/purchase.model';
import EmailService from 'src/email/email.service';
import { EMAIL_NOTIFICATION_CONSTANTS } from 'src/email/email-notification.constants';
import { User } from 'database/models/user.model';
import TelegramService from 'src/telegram/telegram.service';
import { TELEGRAM_NOTIFICATION_CONSTANTS } from 'src/telegram/telegram.constants';
import LoggerService from 'src/logger/logger.service';
import {
  LOGS_ACTIONS_CONSTANTS,
  LOGS_ENTITIES_CONSTANTS,
} from 'src/logger/constants/logger.constants';

@Injectable()
class VinylService {
  constructor(
    @Inject(SEQUELIZE_PROVIDERS_KEYS.VINYLS_REPOSITORY)
    private vinylsRepository: typeof Vinyl,
    @Inject(SEQUELIZE_PROVIDERS_KEYS.PURCHASES_REPOSITORY)
    private purchasesRepository: typeof Purchase,
    @Inject(EmailService) private readonly emailService: EmailService,
    private readonly stripeService: StripeService,
    private readonly telegramService: TelegramService,
    private readonly loggerService: LoggerService,
  ) {}

  private addSearchOptions(
    query: string,
    searchOptions: ISearchOptions,
  ): string {
    let fieldsCount = 0;

    if (searchOptions) {
      query += ` WHERE `;

      if (searchOptions.name) {
        query += `name = ${searchOptions.name} `;
        fieldsCount++;
      }

      if (searchOptions.authorName) {
        if (fieldsCount > 0) {
          query += `AND `;
        }
        query += `authorName = ${searchOptions.authorName}`;
      }
    }
    return query;
  }

  private addSortOptions(query: string, sortOptions: ISortOptions): string {
    if (sortOptions) {
      query += ` ORDER BY `;

      if (sortOptions.ASC) {
        if (Array.isArray(sortOptions.ASC)) {
          const ascColumns = sortOptions.ASC.join(' ASC, ');
          query += ascColumns;
          query += ` ASC`;
        } else {
          const ascColumns = sortOptions.ASC + ' ASC';
          query += ascColumns;
        }
      }

      if (sortOptions.DESC) {
        if (Array.isArray(sortOptions.DESC)) {
          const descColumns = sortOptions.ASC.join(' DESC, ');
          query += descColumns;
          query += ` DESC`;
        } else {
          const descColumns = sortOptions.ASC + ' DESC';
          query += descColumns;
        }
      }
    }
    return query;
  }

  private addPaginationOptions(
    query: string,
    paginationOptions: IPaginationOptions,
  ): string {
    const limit =
      (paginationOptions && paginationOptions.limit) ??
      PAGINATION_CONSTANTS.LIMIT;
    const offset =
      (paginationOptions && paginationOptions.offset) ??
      PAGINATION_CONSTANTS.OFFSET;

    query += ` LIMIT ${limit} OFFSET ${offset}`;
    return query;
  }

  private addOptionsToRequest(
    query: string,
    searchOptions?: ISearchOptions,
    sortOptions?: ISortOptions,
    paginationOptions?: IPaginationOptions,
  ): string {
    const queryWithSearch = this.addSearchOptions(query, searchOptions);
    const queryWithSort = this.addSortOptions(queryWithSearch, sortOptions);
    const queryWithOptions = this.addPaginationOptions(
      queryWithSort,
      paginationOptions,
    );
    return queryWithOptions;
  }

  private mapVinylList(queryResponse: IVinylsQueryResponse[]): IVinyl[] {
    return queryResponse.map((row) => {
      return {
        id: row.id,
        price: row.price,
        name: row.name,
        authorName: row.authorName,
        description: row.description,
        image: row.image,
        review: {
          userId: row.userId,
          reviewDescription: row.reviewDescription,
          reviewDate: row.reviewDate,
          rating: row.rating,
        },
        averageRating: row.averageRating,
      };
    });
  }

  async findVinylList(
    paginationOptions?: IPaginationOptions,
    searchOptions?: ISearchOptions,
    sortOptions?: ISortOptions,
    userId?: number,
  ): Promise<IVinyl[]> {
    const id = userId ?? 0;
    const mainQuery = `SELECT vinyls.*, review.id as reviewId, review.userId, review.description as reviewDescription, review.reviewDate, review.rating, r.averageRating FROM vinyls LEFT JOIN (SELECT vinylId, AVG(rating) AS averageRating FROM reviews GROUP BY vinylId) AS r ON vinyls.id = r.vinylId LEFT JOIN reviews AS review ON vinyls.id = review.vinylId AND review.userId != ${id}`;

    const finalQuery = this.addOptionsToRequest(
      mainQuery,
      searchOptions,
      sortOptions,
      paginationOptions,
    );

    const queryResponse =
      await this.vinylsRepository.sequelize.query<IVinylsQueryResponse>(
        finalQuery,
        {
          type: QueryTypes.SELECT,
        },
      );

    if (!queryResponse) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: VINYL_RESPONSE_MESSAGES.NO_VINYL_LIST,
      });
    }

    return this.mapVinylList(queryResponse);
  }

  async buyVinyl(id: number, quantity: number): Promise<string> {
    const vinyl = await this.vinylsRepository.findOne({ where: { id } });

    const vinylProductPrice =
      await this.stripeService.findOrCreateProduct(vinyl);

    const purchaseSessionURL = await this.stripeService.createStripeSession(
      vinylProductPrice.id,
      quantity,
    );

    return purchaseSessionURL;
  }

  async successPurchase(user: User, session_id: string): Promise<void> {
    const successSession =
      await this.stripeService.getStripeSession(session_id);
    const price = await this.stripeService.getPurchasedProduct(
      successSession.client_reference_id,
    );
    const vinylId = price.product;
    const purchaseDate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const purchase = await this.purchasesRepository.create({
      id: undefined,
      userId: user.id,
      vinylId,
      purchaseDate,
    });

    await this.loggerService.createLog(
      LOGS_ACTIONS_CONSTANTS.CREATED,
      LOGS_ENTITIES_CONSTANTS.PURCHASE,
      purchase.id,
      user.id,
    );

    try {
      const message =
        EMAIL_NOTIFICATION_CONSTANTS.PURCHASE_MESSAGE +
        this.emailService.createPurchaseDetailsMessage(
          vinylId.toString(),
          session_id,
          price.currency,
          price.unit_amount,
        );

      await this.emailService.sendEmailNotification(
        user.email,
        EMAIL_NOTIFICATION_CONSTANTS.PURCHASE_SUBJECT,
        message,
      );
    } catch {
      throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: EMAIL_NOTIFICATION_CONSTANTS.NOTIFICATION_ERROR,
      });
    }
  }

  async addNewVinyl(userId: number, body: CreateVinylDto): Promise<Vinyl> {
    const newVinyl = {
      id: undefined,
      price: body.price,
      name: body.name,
      authorName: body.authorName,
      image: body.image,
      description: body.description,
    };
    const vinyl = await this.vinylsRepository.create(newVinyl);

    await this.loggerService.createLog(
      LOGS_ACTIONS_CONSTANTS.CREATED,
      LOGS_ENTITIES_CONSTANTS.VINYL,
      vinyl.id,
      userId,
    );

    try {
      await this.telegramService.sendTelegramNotification(vinyl);
    } catch {
      throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: TELEGRAM_NOTIFICATION_CONSTANTS.ERROR,
      });
    }

    return vinyl;
  }

  private async changeVinylData(
    vinyl: Vinyl,
    data: UpdateVinylDto,
  ): Promise<void> {
    for (const [key, value] of Object.entries(data)) {
      if (value != null) await vinyl.update({ [key]: value });
    }
  }

  async editVinyl(
    id: number,
    userId: number,
    body: UpdateVinylDto,
  ): Promise<void> {
    const vinyl = await this.vinylsRepository.findOne({ where: { id } });

    if (!vinyl) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: VINYL_RESPONSE_MESSAGES.VINYL_NOT_FOUND,
      });
    }

    await this.changeVinylData(vinyl, body);

    await this.loggerService.createLog(
      LOGS_ACTIONS_CONSTANTS.UPDATED,
      LOGS_ENTITIES_CONSTANTS.VINYL,
      id,
      userId,
    );
  }

  async removeVinyl(id: number, userId: number): Promise<void> {
    const vinyl = await this.vinylsRepository.findOne({ where: { id } });

    if (!vinyl) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: VINYL_RESPONSE_MESSAGES.VINYL_NOT_FOUND,
      });
    }

    await this.vinylsRepository.destroy({ where: { id } });

    await this.loggerService.createLog(
      LOGS_ACTIONS_CONSTANTS.DELETED,
      LOGS_ENTITIES_CONSTANTS.VINYL,
      id,
      userId,
    );
  }
}
export default VinylService;
