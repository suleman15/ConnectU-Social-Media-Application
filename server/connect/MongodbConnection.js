import mongoose from "mongoose";

async function MongoDBConnection() {
  try {
    let connection = await mongoose.connect(
      "mongodb+srv://sulemanahmed27048:neon123@cluster0.otnrxs3.mongodb.net/movies" || "mongodb://localhost:27017/connectu"
    );
    console.log("Connected To the DB");
  } catch (error) {
    console.log(`This is an Error: ${error.message}`);
  }
}
export default MongoDBConnection;
