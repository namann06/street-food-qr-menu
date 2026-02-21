import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shopId: string }> }
) {
  try {
    await connectDB();
    
    // Get and await the shopId parameter
    const { shopId } = await params;

    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return NextResponse.json(
        { error: 'Invalid shop ID' },
        { status: 400 }
      );
    }

    const orders = await Order.find({
      shopId: new mongoose.Types.ObjectId(shopId),
    })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean()
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
  { params }: { params: Promise<{ shopId: string }> }
) {
  try {
    await connectDB();
    
    // Get and await the shopId parameter
    const { shopId } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return NextResponse.json(
        { error: 'Invalid shop ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
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
    );

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
