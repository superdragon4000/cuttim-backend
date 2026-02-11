import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ShippingMethod } from '../../model/order.entity';

export class ShippingAddressDto {
  @IsString()
  @MaxLength(128)
  recipientName: string;

  @IsString()
  @MaxLength(32)
  recipientPhone: string;

  @IsString()
  @MaxLength(64)
  country: string;

  @IsString()
  @MaxLength(128)
  city: string;

  @IsString()
  @MaxLength(255)
  addressLine1: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine2?: string;

  @IsString()
  @MaxLength(32)
  postalCode: string;

  @IsEnum(ShippingMethod)
  method: ShippingMethod;
}
