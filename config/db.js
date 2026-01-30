import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vtechsoft', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.log('Server will run without database. Update MONGODB_URI in .env to enable full functionality.');
    isConnected = false;
  }
};

export const checkConnection = () => isConnected;

export default connectDB;
