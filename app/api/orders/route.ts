import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';
import { notifyShopClients } from './[shopId]/events/route';

// Function to generate a unique order ID
async function generateOrderId() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  // Get the count of orders for today
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);
  
  const count = await Order.countDocuments({
    createdAt: {
      $gte: startOfDay,
      $lt: endOfDay
    }
  });
  
  // Generate order ID in format: ORD-YYMMDD-XXXX where XXXX is the sequential number
  const sequence = (count + 1).toString().padStart(4, '0');
  const orderId = `ORD-${year}${month}${day}-${sequence}`;

  // Verify this order ID doesn't already exist (just in case)
  const existingOrder = await Order.findOne({ orderId });
  if (existingOrder) {
    // If it exists, try the next number
    return generateOrderId();
  }

  return orderId;
}

export async function POST(request: Request) {
  try {
    // Connect to database
    await connectDB();

    const body = await request.json();
    const { items, total, tableNumber, paymentMethod, shopId } = body;

    console.log('Creating order with data:', body);

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required and must not be empty' },
        { status: 400 }
      );
    }

    if (!total || typeof total !== 'number' || total <= 0) {
      return NextResponse.json(
        { error: 'Valid total amount is required' },
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
        { error: 'Valid payment method (upi or counter) is required' },
        { status: 400 }
      );
    }

    if (!shopId || !mongoose.Types.ObjectId.isValid(shopId)) {
      return NextResponse.json(
        { error: 'Valid shop ID is required' },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = await generateOrderId();

    // Create new order
    const order = await Order.create({
      orderId,
      shopId: new mongoose.Types.ObjectId(shopId),
      items,
      total,
      tableNumber,
      paymentMethod,
      status: 'pending'
    });

    // Notify connected clients about the new order
    notifyShopClients(shopId, {
      type: 'new_order',
      order
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Error creating order' },
      { status: 500 }
    );
  }
}
