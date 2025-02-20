import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    // Connect to database
    await connectDB();

    const { items, total, tableNumber, paymentMethod, shopId } = await request.json();

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid items' },
        { status: 400 }
      );
    }

    if (!tableNumber) {
      return NextResponse.json(
        { error: 'Table number is required' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !['upi', 'counter'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Create new order
    const order = await Order.create({
      shopId: new mongoose.Types.ObjectId(shopId),
      items,
      total,
      tableNumber,
      paymentMethod,
      status: 'pending'
    });

    return NextResponse.json({ orderId: order._id });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Error creating order' },
      { status: 500 }
    );
  }
}
