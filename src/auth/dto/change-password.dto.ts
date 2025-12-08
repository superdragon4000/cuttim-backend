import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export default class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsNotEmpty()
  oldPassword: string;
  
  @ApiProperty({ example: 'newPassword456' })
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
