import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import MongoDBConnection from "./connect/MongodbConnection.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import router from "./Router/index.js";
import path from "path";
import morgan from "morgan";

dotenv.config();

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const __dirname = path.resolve(path.dirname(""));

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views/"));
app.use(express.static("js"));
const PORT = process.env.PORT || 8000;

MongoDBConnection();

// adding post method
app.use(express.json());

app.use(helmet()); // extra protection

app.use(cors()); // aviod cors error
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(router);

//error middleware
app.use(errorMiddleware);
app.listen(8800, () => {
  console.clear();
  console.log("This server is running on the port 8800");
});
