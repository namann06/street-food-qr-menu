import mongoose from 'mongoose';

export interface IOrder {
  shopId: mongoose.Types.ObjectId;
  orderId: string;
  items: Array<{
    _id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  tableNumber: string;
  paymentMethod: 'upi' | 'counter';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

interface OrderModel extends mongoose.Model<IOrder> {
  generateOrderId(): Promise<string>;
}

const OrderSchema = new mongoose.Schema<IOrder, OrderModel>({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Shop'
  },
  orderId: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  items: [{
    _id: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  total: {
    type: Number,
    required: true
  },
  tableNumber: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'counter'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Function to generate a unique order ID
OrderSchema.statics.generateOrderId = async function() {
  try {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get the count of orders for today
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);
    
    const count = await this.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });
    
    // Generate order ID in format: ORD-YYMMDD-XXXX where XXXX is the sequential number
    const sequence = (count + 1).toString().padStart(4, '0');
    const orderId = `ORD-${year}${month}${day}-${sequence}`;

    // Verify this order ID doesn't already exist (just in case)
    const existingOrder = await this.findOne({ orderId });
    if (existingOrder) {
      // If it exists, try the next number
      return this.generateOrderId();
    }

    return orderId;
  } catch (error) {
    console.error('Error generating order ID:', error);
    throw new Error('Failed to generate order ID');
  }
};

// Add index for better performance
OrderSchema.index({ shopId: 1, createdAt: -1 });

const Order = mongoose.models.Order as OrderModel || mongoose.model<IOrder, OrderModel>('Order', OrderSchema);

export default Order;
