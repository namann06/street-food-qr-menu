import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { shopId: string } }
) {
  try {
    await connectDB();
    const shopId = params.shopId;

    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return NextResponse.json(
        { error: 'Invalid shop ID' },
        { status: 400 }
      );
    }

    const orders = await Order.find({
      shopId: new mongoose.Types.ObjectId(shopId),
    })
      .sort({ createdAt: -1 }) // Most recent first
      .select('-__v') // Exclude version field
      .lean() // Convert to plain JavaScript objects
      .exec();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { shopId: string } }
) {
  try {
    await connectDB();
    const shopId = params.shopId;
    
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return NextResponse.json(
        { error: 'Invalid shop ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status || !['completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid order ID or status' },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        shopId: new mongoose.Types.ObjectId(shopId)
      },
      { status },
      { new: true }
    )
      .select('-__v')
      .lean();

    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
