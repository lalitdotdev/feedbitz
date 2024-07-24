import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export const dbConnect = async () => {
  if (connection.isConnected) {
    console.log('🔵 Already connected to MongoDB');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
    connection.isConnected = db.connections[0].readyState;
    console.log('🔵 Connected to MongoDB ');
  } catch (error) {
    console.error('🔴 Error connecting to MongoDB:', error);
  }
};

export default dbConnect;
