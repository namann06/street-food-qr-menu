import mongoose from 'mongoose';

interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseConnection;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable. Create a MongoDB Atlas cluster and use its connection string.'
  );
}

// Initialize the cached connection object
if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null
  };
}

const cached = global.mongoose;

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 20000, // Timeout after 20 seconds
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 10000,
      connectTimeoutMS: 10000,
    };

    try {
      cached.promise = mongoose.connect(MONGODB_URI!, opts);
      console.log('MongoDB connection initiated');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully');
    return cached.conn;
  } catch (e) {
    console.error('MongoDB connection failed:', e);
    cached.promise = null;
    throw e;
  }
}

export default connectDB;
