import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Review } from 'database/models/review.model';
import { Request, Response } from 'express';
import { CreateReviewDto } from 'src/review/create-review.dto';
import ReviewsService from './review.service';
import { IPaginationOptions } from 'src/pagination/IPaginationOptions';
import { Roles } from 'src/role/roles.decorator';
import { ROLES_CONSTANTS } from 'src/role/roles.constants';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GoogleAuthGuard } from 'src/auth/utils/google-auth.guard';
import { REVIEW_RESPONSE_MESSAGES } from './review-response.messages';

@ApiTags('reviews')
@Controller('vinyls/:id')
class ReviewController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiCreatedResponse({ type: Review })
  @Post('reviews')
  @UseGuards(GoogleAuthGuard)
  @UsePipes(new ValidationPipe())
  async createReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() createReviewDto: CreateReviewDto,
    @Req() request: Request,
    @Res() response: Response<Review>,
  ): Promise<void> {
    const newReview = await this.reviewsService.addReview(
      id,
      createReviewDto,
      request.user.id,
    );
    response.status(HttpStatus.CREATED).send(newReview);
  }

  @ApiOkResponse({ type: [Review] })
  @Get('reviews')
  async getReviewsForVinyl(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response<Review[]>,
    @Query('paginationOptions')
    paginationOptions?: IPaginationOptions,
  ): Promise<void> {
    const reviews = await this.reviewsService.getAllReviewsForVinyl(
      id,
      paginationOptions,
    );
    response.status(HttpStatus.OK).send(reviews);
  }

  @ApiForbiddenResponse()
  @ApiNoContentResponse()
  @Delete('reviews/:reviewId(\\d+)')
  @UseGuards(GoogleAuthGuard)
  @Roles([ROLES_CONSTANTS.ADMIN])
  async deleteReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    await this.reviewsService.removeReview(reviewId, request.user.id);
    response
      .status(HttpStatus.NO_CONTENT)
      .send(REVIEW_RESPONSE_MESSAGES.REVIEW_WAS_DELETED);
  }
}
export default ReviewController;
