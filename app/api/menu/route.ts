import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Shop from '@/models/Shop';
import MenuItem from '@/models/MenuItem';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { name, description, price, category, image } = await req.json();

    if (!name || !price) {
      return NextResponse.json(
        { message: 'Name and price are required' },
        { status: 400 }
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

    // Create menu item
    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      image, 
      shop: shop._id,
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { message: 'Error creating menu item' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id, name, description, price, category, available, image } = await req.json();

    if (!id || !name || !price) {
      return NextResponse.json(
        { message: 'ID, name, and price are required' },
        { status: 400 }
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

    // Update menu item
    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: id, shop: shop._id },
      { name, description, price, category, available, image },
      { new: true }
    );

    if (!menuItem) {
      return NextResponse.json(
        { message: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { message: 'Error updating menu item' },
      { status: 500 }
    );
  }
}
