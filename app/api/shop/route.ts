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
