import { Body, Controller, Post } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { CalculatePriceDto } from './dto/calculate-price.dto';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post('calculate')
  async calculatePrice(@Body() dto: CalculatePriceDto) {
    return await this.pricingService.calculatePrice(dto);
  }
}
