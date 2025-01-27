import { ApiProperty } from '@nestjs/swagger';
import { Purchase } from 'database/models/purchase.model';
import { Review } from 'database/models/review.model';

export class IUserProfile {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  birthdate: string | undefined;

  @ApiProperty()
  avatar: string;

  @ApiProperty({ type: [Review] })
  reviews: Review[];

  @ApiProperty({ type: [Purchase] })
  purchases: Purchase[];
}
