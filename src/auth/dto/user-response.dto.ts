import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: '+1234567890', nullable: true })
  phone?: string;

  @ApiProperty({ example: 'client' })
  role: string;

  @ApiProperty({ example: 'John Doe', nullable: true })
  name?: string;
}
