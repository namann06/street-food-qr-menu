import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: { shopId: string } }
) {
  try {
    await connectDB();

    const orders = await Order.find({
      shopId: new mongoose.Types.ObjectId(params.shopId),
    })
      .sort({ createdAt: -1 }) // Most recent first
      .exec();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Error fetching orders' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { shopId: string } }
) {
  try {
    await connectDB();

    const { orderId, status } = await request.json();

    const order = await Order.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(orderId),
        shopId: new mongoose.Types.ObjectId(params.shopId),
      },
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Error updating order' },
      { status: 500 }
    );
  }
}
