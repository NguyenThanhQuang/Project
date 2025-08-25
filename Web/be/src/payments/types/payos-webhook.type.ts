export interface PayOSWebhookTransaction {
  orderCode: number;
  amount: number;
  description: string;
  status: 'PENDING' | 'PROCESSING' | 'PAID' | 'CANCELLED';
  transactionDateTime: string;
}

export interface PayOSWebhookBody {
  code: string;
  desc: string;
  data?: PayOSWebhookTransaction;
  signature: string;
}
