import { ApiProperty } from '@nestjs/swagger';

export class IVinyl {
  @ApiProperty()
  id: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  authorName: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  review: {
    userId: number;
    reviewDescription: string;
    reviewDate: string;
    rating: number;
  };

  @ApiProperty()
  averageRating: number;
}
