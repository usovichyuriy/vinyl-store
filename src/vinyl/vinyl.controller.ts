import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import VinylsService from './vinyl.service';
import { CreateVinylDto } from './dto/create-vinyl.dto';
import { Vinyl } from 'database/models/vinyl.model';
import { Request, Response } from 'express';
import { UpdateVinylDto } from './dto/update-vinyl.dto';
import { IPaginationOptions } from 'src/pagination/IPaginationOptions';
import { VINYL_RESPONSE_MESSAGES } from './vinyl-response.messages';
import { IVinyl } from './interfaces/IVinyl';
import { UpdateVinylValidationPipe } from './update-vinyl.pipe';
import { Roles } from 'src/role/roles.decorator';
import { ROLES_CONSTANTS } from 'src/role/roles.constants';
import { ISearchOptions } from './interfaces/ISearchOptions';
import { ISortOptions } from './interfaces/ISortOptions';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GoogleAuthGuard } from 'src/auth/utils/google-auth.guard';

@ApiTags('vinyls')
@Controller('vinyls')
class VinylController {
  constructor(private readonly vinylsService: VinylsService) {}

  @ApiNotFoundResponse()
  @ApiOkResponse({ type: [IVinyl] })
  @Get()
  async getVinylList(
    @Req() request: Request,
    @Res() response: Response<IVinyl[]>,
    @Query('paginationOptions') paginationOptions?: IPaginationOptions,
    @Query('sortOptions') sortOptions?: ISortOptions,
  ): Promise<void> {
    const vinylList = await this.vinylsService.findVinylList(
      paginationOptions,
      undefined,
      sortOptions,
      request.user?.id,
    );
    response.status(HttpStatus.OK).send(vinylList);
  }

  @ApiNotFoundResponse()
  @ApiOkResponse({ type: [IVinyl] })
  @UseGuards(GoogleAuthGuard)
  @Get('search')
  async searchVinyls(
    @Req() request: Request,
    @Res() response: Response<IVinyl[]>,
    @Query('paginationOptions') paginationOptions?: IPaginationOptions,
    @Query('searchOptions') searchOptions?: ISearchOptions,
    @Query('sortOptions') sortOptions?: ISortOptions,
  ) {
    const vinylList = await this.vinylsService.findVinylList(
      paginationOptions,
      searchOptions,
      sortOptions,
      request.user.id,
    );
    response.status(HttpStatus.OK).send(vinylList);
  }

  @ApiOkResponse({ type: String })
  @UseGuards(GoogleAuthGuard)
  @Get(':id/purchase')
  async purchaseVinyl(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ): Promise<void> {
    const purchaseUrl = await this.vinylsService.buyVinyl(id, 1);
    response.status(HttpStatus.OK).redirect(purchaseUrl);
  }

  @ApiOkResponse({ type: String })
  @Get('purchase/success')
  async successPurchase(
    @Query('session_id') session_id: string,
    @Req() request: Request,
    @Res() response: Response<string>,
  ): Promise<void> {
    await this.vinylsService.successPurchase(request.user, session_id);
    response
      .status(HttpStatus.OK)
      .send(VINYL_RESPONSE_MESSAGES.VINYL_WAS_PURCHASED);
  }

  @ApiForbiddenResponse()
  @ApiInternalServerErrorResponse()
  @ApiCreatedResponse({ type: Vinyl })
  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(GoogleAuthGuard)
  @Roles([ROLES_CONSTANTS.ADMIN])
  async createVinyl(
    @Body() createVinylDto: CreateVinylDto,
    @Req() request: Request,
    @Res() response: Response<Vinyl>,
  ): Promise<void> {
    const newVinyl = await this.vinylsService.addNewVinyl(
      request.user.id,
      createVinylDto,
    );
    response.status(HttpStatus.CREATED).send(newVinyl);
  }

  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({ description: VINYL_RESPONSE_MESSAGES.VINYL_WAS_UPDATED })
  @Put(':id(\\d+)')
  @UseGuards(GoogleAuthGuard)
  @Roles([ROLES_CONSTANTS.ADMIN])
  async updateVinyl(
    @Param('id', ParseIntPipe) id: number,
    @Body(new UpdateVinylValidationPipe()) updateVinylDto: UpdateVinylDto,
    @Req() request: Request,
    @Res() response: Response<string>,
  ): Promise<void> {
    await this.vinylsService.editVinyl(id, request.user.id, updateVinylDto);
    response
      .status(HttpStatus.OK)
      .send(VINYL_RESPONSE_MESSAGES.VINYL_WAS_UPDATED);
  }

  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @Delete(':id(\\d+)')
  @UseGuards(GoogleAuthGuard)
  @Roles([ROLES_CONSTANTS.ADMIN])
  async deleteVinyl(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
    @Res() response: Response<string>,
  ): Promise<void> {
    await this.vinylsService.removeVinyl(id, request.user.id);
    response
      .status(HttpStatus.NO_CONTENT)
      .send(VINYL_RESPONSE_MESSAGES.VINYL_WAS_DELETED);
  }
}
export default VinylController;
