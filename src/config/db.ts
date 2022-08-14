import mongoose from "mongoose";
require("dotenv").config({ path: ".env" });

export default async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO!);
    console.log(`⚡️ [database]: Database is connected`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
