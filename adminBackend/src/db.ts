import mongoose from "mongoose";
 
export const connectDB = async () => {
  const uri = process.env.MONGO_URI ?? "mongodb+srv://amanmfp025_db_user:tKO5rny9P8Gk3nZ1@cluster0.lzoivdw.mongodb.net/";
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};