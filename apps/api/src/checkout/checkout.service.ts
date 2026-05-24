import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { CreateCheckoutDto } from './checkout.dto';

const PRODUCTS: Record<string, { name: string; credits: number; price: number }> = {
  credit_15: { name: 'Paket Kredit 15', credits: 15, price: 49000 },
  pro_monthly: { name: 'Bulanan Pro', credits: 60, price: 99000 },
  pro_yearly: { name: 'Tahunan Pro', credits: 720, price: 950000 },
};

@Injectable()
export class CheckoutService {
  private readonly sessions = new Map<string, any>();

  create(dto: CreateCheckoutDto, userId: string) {
    const product = PRODUCTS[dto.product];
    const sessionId = v4();
    const session = {
      id: sessionId,
      userId,
      product: dto.product,
      productName: product.name,
      credits: product.credits,
      amount: product.price,
      currency: 'IDR',
      status: 'pending',
      paymentUrl: `https://payment.stub/checkout/${sessionId}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  get(id: string) {
    const session = this.sessions.get(id);
    if (!session) {
      return { id, status: 'not_found' };
    }
    return session;
  }
}
