import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Shop from '@/models/Shop';
import MenuItem from '@/models/MenuItem';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find shop owned by the user
    const shop = await Shop.findOne({ owner: session.user.id });
    
    if (!shop) {
      return NextResponse.json(
        { message: 'Shop not found' },
        { status: 404 }
      );
    }

    // Get menu items for the shop
    const menuItems = await MenuItem.find({ shop: shop._id });

    return NextResponse.json({ shop, menuItems });
  } catch (error) {
    console.error('Error fetching shop data:', error);
    return NextResponse.json(
      { message: 'Error fetching shop data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if user already has a shop
    const existingShop = await Shop.findOne({ owner: session.user.id });
    if (existingShop) {
      return NextResponse.json(
        { message: 'Shop already exists' },
        { status: 400 }
      );
    }

    // Parse request body
    const { name, description, address } = await request.json();

    // Validate input
    if (!name) {
      return NextResponse.json(
        { message: 'Shop name is required' },
        { status: 400 }
      );
    }

    // Create new shop
    const newShop = new Shop({
      name,
      description: description || '',
      address: address || '',
      owner: session.user.id,
    });

    await newShop.save();

    return NextResponse.json(
      { 
        message: 'Shop created successfully', 
        shop: newShop 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating shop:', error);
    return NextResponse.json(
      { message: 'Error creating shop' },
      { status: 500 }
    );
  }
}
