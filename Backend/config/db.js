import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Construct MongoDB URI from environment variables for better security
    const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_CLUSTER, MONGODB_DATABASE } = process.env;
    
    // Validate required environment variables
    if (!MONGODB_USERNAME || !MONGODB_PASSWORD || !MONGODB_CLUSTER || !MONGODB_DATABASE) {
      throw new Error('Missing required MongoDB environment variables');
    }
    
    const mongoURI = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_CLUSTER}/${MONGODB_DATABASE}?retryWrites=true&w=majority`;
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
