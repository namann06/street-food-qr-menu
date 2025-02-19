import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Shop from '@/models/Shop';
import MenuItem from '@/models/MenuItem';

export async function GET(
  request: Request,
  context: { params: { shopId: string } }
) {
  const { shopId } = context.params;
  
  try {
    await connectDB();

    // Find the shop
    const shop = await Shop.findById(shopId);
    
    if (!shop) {
      return NextResponse.json(
        { message: 'Shop not found' },
        { status: 404 }
      );
    }

    // Find all menu items for this shop
    const menuItems = await MenuItem.find({ shop: shopId });

    return NextResponse.json({
      shop: {
        _id: shop._id,
        name: shop.name,
        address: shop.address
      },
      menuItems
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
