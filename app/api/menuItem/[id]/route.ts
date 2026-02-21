import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MenuItem from '@/models/MenuItem';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, description, price, category, available } = body;

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
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
      return NextResponse.json(
        { message: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedMenuItem);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error updating menu item' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  
  try {
    await connectDB();
    
    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return NextResponse.json(
        { message: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching menu item' },
      { status: 500 }
    );
  }
}
