import { IsString, MaxLength } from 'class-validator';

export class UpdateTrackingDto {
  @IsString()
  @MaxLength(128)
  trackingNumber: string;
}
