import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentRequestDto } from './dto/createPaymentRequest.dto';
import { JwtAuthGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { YooKassaWebhookDto } from './dto/yookassa-webhook.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Post('create')
  createPayment(@CurrentUser() user: any, @Body() dto: CreatePaymentRequestDto) {
    return this.paymentsService.createPayment(user, dto);
  }

  @HttpCode(200)
  @Post('webhook/yookassa')
  yookassaWebhook(@Body() payload: YooKassaWebhookDto) {
    return this.paymentsService.handleYooKassaWebhook(payload);
  }
}
