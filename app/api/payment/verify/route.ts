import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { notifyShopClients } from '@/app/api/orders/[shopId]/events/route';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { sessionId, orderId } = await request.json();

    // Retrieve the session from Stripe to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Update order with payment details
    await connectDB();
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentStatus: 'paid',
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
      },
      { new: true }
    );

    // Now that payment is confirmed, notify the shop about the new order
    if (updatedOrder) {
      notifyShopClients(updatedOrder.shopId.toString(), {
        type: 'new_order',
        order: updatedOrder,
      });
    }

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
