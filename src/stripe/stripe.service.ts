import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Vinyl } from 'database/models/vinyl.model';
import Stripe from 'stripe';

@Injectable()
class StripeService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_API_KEY'));
  }

  async findOrCreateProduct(vinyl: Vinyl): Promise<Stripe.Price> {
    try {
      const price = await this.stripe.prices.list({
        product: vinyl.id.toString(),
      });

      if (price.data.length > 0) {
        const priceId = price.data[0].id;
        return this.stripe.prices.retrieve(priceId);
      }
    } catch {
      const currency = this.configService.get<string>('STRIPE_PRICE_CURRENCY');
      const product = await this.stripe.products.create({
        id: vinyl.id.toString(),
        name: vinyl.name,
        description: vinyl.description,
      });

      const price: Stripe.Price = await this.stripe.prices.create({
        product: product.id,
        unit_amount: vinyl.price * 100,
        currency,
      });
      return price;
    }
  }

  async createStripeSession(price: string, quantity: number): Promise<string> {
    const mode =
      this.configService.get<Stripe.Checkout.SessionCreateParams.Mode>(
        'STRIPE_SESSION_MODE',
      );
    const successUrl = this.configService.get<string>(
      'STRIPE_SESSION_SUCCESS_URL',
    );
    const cancelUrl = this.configService.get<string>(
      'STRIPE_SESSION_CANCEL_URL',
    );

    const checkoutSession = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price,
          quantity,
        },
      ],
      mode,
      client_reference_id: price,
      payment_intent_data: {
        setup_future_usage: 'on_session',
      },
      success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl,
    });

    return checkoutSession.url;
  }

  async getStripeSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.retrieve(sessionId);
  }

  async getPurchasedProduct(priceId: string): Promise<Stripe.Price> {
    return await this.stripe.prices.retrieve(priceId);
  }
}
export default StripeService;
