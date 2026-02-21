import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';
import Shop from '@/models/Shop';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string; shopId: string }> }
) {
  // Extract parameters directly from context
  const { id, shopId: rawShopId } = await context.params;

  console.log('Received PUT request with raw params:', { 
    id, 
    rawShopId, 
    rawShopIdType: typeof rawShopId 
  });

  try {
    await connectDB();

    // Verify user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('No active session');
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('Session user ID:', session.user.id);

    // Parse request body to get shop ID
    const body = await request.json();
    console.log('Request body:', body);

    // Determine shop ID from body or params
    let shopId: string;
    if (body.shop) {
      shopId = typeof body.shop === 'object' ? body.shop._id : body.shop;
    } else {
      shopId = rawShopId;
    }

    console.log('Determined shopId:', shopId);

    // Validate shopId
    if (!shopId || !mongoose.Types.ObjectId.isValid(shopId)) {
      console.log('Invalid shop ID:', shopId);
      return NextResponse.json(
        { message: 'Invalid shop ID' },
        { status: 400 }
      );
    }

    // Verify shop ownership
    const shop = await Shop.findOne({ 
      _id: new mongoose.Types.ObjectId(shopId), 
      owner: session.user.id 
    });

    if (!shop) {
      console.log('Shop not found or user not authorized:', { 
        shopId, 
        userId: session.user.id 
      });
      return NextResponse.json(
        { message: 'Unauthorized access to shop' },
        { status: 403 }
      );
    }

    // Destructure body with fallback values
    const { 
      name = '', 
      description = '', 
      price = 0, 
      category = '', 
      available = false 
    } = body;

    // Find and update menu item
    const updatedMenuItem = await MenuItem.findOneAndUpdate(
      { _id: id, shop: shopId },
      {
        name,
        description,
        price,
        category,
        available
      },
      { new: true }
    );

    if (!updatedMenuItem) {
      console.log('Menu item not found:', { id, shopId });
      return NextResponse.json(
        { message: 'Menu item not found' },
        { status: 404 }
      );
    }

    console.log('Successfully updated menu item');
    return NextResponse.json(updatedMenuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { 
        message: 'Error updating menu item', 
        details: String(error),
        rawError: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string; shopId: string }> }
) {
  // Properly unwrap params
  const params = await context.params;
  const { id, shopId } = params;

  try {
    await connectDB();

    // Validate shopId
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return NextResponse.json(
        { message: 'Invalid shop ID' },
        { status: 400 }
      );
    }

    // Find menu item
    const menuItem = await MenuItem.findOne({ 
      _id: id, 
      shop: shopId 
    });

    if (!menuItem) {
      return NextResponse.json(
        { message: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      { message: 'Error fetching menu item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string; shopId: string }> }
) {
  // Extract parameters directly from context
  const { id, shopId } = await context.params;

  try {
    await connectDB();

    // Verify user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Validate shopId
    if (!shopId || !mongoose.Types.ObjectId.isValid(shopId)) {
      return NextResponse.json(
        { message: 'Invalid shop ID' },
        { status: 400 }
      );
    }

    // Verify shop ownership
    const shop = await Shop.findOne({ 
      _id: new mongoose.Types.ObjectId(shopId), 
      owner: session.user.id 
    });

    if (!shop) {
      return NextResponse.json(
        { message: 'Unauthorized access to shop' },
        { status: 403 }
      );
    }

    // Find and delete menu item
    const deletedMenuItem = await MenuItem.findOneAndDelete({
      _id: id,
      shop: shopId
    });

    if (!deletedMenuItem) {
      return NextResponse.json(
        { message: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Menu item deleted successfully',
      deletedItem: deletedMenuItem
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { 
        message: 'Error deleting menu item', 
        details: String(error)
      },
      { status: 500 }
    );
  }
}
