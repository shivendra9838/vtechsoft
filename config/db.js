import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set');
      console.log('Server will run without database. Set MONGODB_URI in .env to enable full functionality.');
      isConnected = false;
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('Server will run without database. Check MONGODB_URI in .env to enable full functionality.');
    isConnected = false;
  }
};

export const checkConnection = () => isConnected;

export default connectDB;
