import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

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

    if (!shopId || !mongoose.Types.ObjectId.isValid(shopId)) {
      return NextResponse.json(
        { error: 'Invalid shop ID' },
        { status: 400 }
      );
    }

    // Generate unique order ID
    console.log('Generating order ID...');
    const orderId = await generateOrderId();
    console.log('Generated order ID:', orderId);

    // Create new order
    console.log('Creating order in database...');
    const order = await Order.create({
      shopId: new mongoose.Types.ObjectId(shopId),
      orderId,
      items: items.map(item => ({
        _id: item._id.toString(),
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total,
      tableNumber,
      paymentMethod
    });

    console.log('Order created successfully:', order);

    return NextResponse.json({ 
      message: 'Order created successfully',
      order: order.toObject()
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    );
  }
}
