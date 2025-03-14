import mongoose from "mongoose"

const connectDB = async () => {
  try {
    // console.log("MongoDB URL:", process.env.MONGO_URL);
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
