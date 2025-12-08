import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '+1234567890' })
  @IsOptional()
  phone?: string;
}
