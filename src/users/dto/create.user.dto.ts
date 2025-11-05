import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../model/user.entity';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  phone?: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  role: UserRole;

  name: string;
}
