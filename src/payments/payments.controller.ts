import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentRequestDto } from './dto/createPaymentRequest.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  createPayment(@Body() dto: CreatePaymentRequestDto) {
    return this.paymentsService.createPayment(dto);
  }
}
