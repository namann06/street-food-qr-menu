import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { amount, orderId, shopId } = await request.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Order #${orderId}`,
            },
            unit_amount: Math.round(amount * 100), // Stripe expects amount in paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/order-confirmation?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}&shopId=${shopId}`,
      cancel_url: `${origin}/order-confirmation?orderId=${orderId}&cancelled=true&shopId=${shopId}`,
      metadata: {
        orderId,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    );
  }
}
