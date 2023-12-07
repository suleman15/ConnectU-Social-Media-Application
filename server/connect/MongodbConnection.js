import mongoose from "mongoose";

async function MongoDBConnection() {
  try {
    let connection = await mongoose.connect(
      process.env.MONGODB_URL || "mongodb://localhost:27017/connectu"
    );
    console.log("Connected To the DB");
  } catch (error) {
    console.log(`This is an Error: ${error.message}`);
  }
}
export default MongoDBConnection;
