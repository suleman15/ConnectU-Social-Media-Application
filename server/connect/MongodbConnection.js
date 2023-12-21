import mongoose from "mongoose";

async function MongoDBConnection() {
  try {
    let connection = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected To the DB");
  } catch (error) {
    console.log(`This is an Error: ${error.message}`);
  }
}
export default MongoDBConnection;
