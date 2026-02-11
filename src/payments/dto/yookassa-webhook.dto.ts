export class YooKassaWebhookMetadataDto {
  orderId?: string;
  userId?: string;
}

export class YooKassaWebhookAmountDto {
  value?: string;
  currency?: string;
}

export class YooKassaWebhookPaymentObjectDto {
  id?: string;
  status?: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
  metadata?: YooKassaWebhookMetadataDto;
  amount?: YooKassaWebhookAmountDto;
}

export class YooKassaWebhookDto {
  type?: string;
  event?: string;
  object?: YooKassaWebhookPaymentObjectDto;
}
