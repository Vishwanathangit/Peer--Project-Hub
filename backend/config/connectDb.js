import mongoose from "mongoose";

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected`);
  } catch (err) {
    console.log(`Error in Connecting MongoDB - ${err.message}`);
    process.exit(1);
  }
}

export default connectDb;
