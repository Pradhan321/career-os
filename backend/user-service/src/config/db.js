import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}`
    );
  } catch (error) {
    console.error("Database Connection Error:", error);
    process.exit(1);
  }
};
export const closeDB = async () => {
  await mongoose.connection.close();

  console.log(
    "🛑 Auth Service MongoDB Connection Closed"
  );
};
export default connectDB;

