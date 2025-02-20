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

    if (!mongoose.Types.ObjectId.isValid(params.shopId)) {
      return NextResponse.json(
        { error: 'Invalid shop ID' },
        { status: 400 }
      );
    }

    const orders = await Order.find({
      shopId: new mongoose.Types.ObjectId(params.shopId),
    })
      .sort({ createdAt: -1 }) // Most recent first
      .select('-__v') // Exclude version field
      .lean() // Convert to plain JavaScript objects
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

    if (!mongoose.Types.ObjectId.isValid(params.shopId)) {
      return NextResponse.json(
        { error: 'Invalid shop ID' },
        { status: 400 }
      );
    }

    const { orderId, status } = await request.json();

    if (!orderId || !status || !['completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid order ID or status' },
        { status: 400 }
      );
    }

    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        shopId: new mongoose.Types.ObjectId(params.shopId)
      },
      { status },
      { new: true }
    )
      .select('-__v')
      .lean();

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
