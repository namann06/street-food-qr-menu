import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
import Shop from '@/models/Shop';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Properly unwrap params
  const { id } = await context.params;

  try {
    // Verify user session
    const session = await getServerSession(authOptions);
    
    // Detailed logging for debugging
    console.log('Session details:', JSON.stringify(session, null, 2));

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the shop for the current user
    const shop = await Shop.findOne({ owner: session.user.id });

    if (!shop) {
      // If no shop exists, create a default shop
      const newShop = new Shop({
        name: `${session.user.name}'s Shop`,
        owner: session.user.id,
        description: 'Default shop created automatically'
      });
      await newShop.save();

      // Update the session with the new shop ID
      session.user.shopId = newShop._id.toString();
    }

    // Find the menu item
    const menuItem = await MenuItem.findById(id).populate('shop');

    if (!menuItem) {
      return NextResponse.json(
        { message: 'Menu item not found' },
        { status: 404 }
      );
    }

    // Check if the menu item belongs to the user's shop
    const userShop = shop || await Shop.findOne({ owner: session.user.id });
    if (menuItem.shop._id.toString() !== userShop._id.toString()) {
      return NextResponse.json(
        { message: 'Unauthorized access to menu item' },
        { status: 403 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
