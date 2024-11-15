import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'food',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
