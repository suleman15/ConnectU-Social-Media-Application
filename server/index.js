import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import helmet from "helmet";
import MongoDBConnection from "./connect/MongodbConnection.js";
import errorMiddleware, { handleError } from "./middleware/errorMiddleware.js";
import router from "./Router/index.js";
import path from "path";

dotenv.config();
const __dirname = path.resolve(path.dirname(""));

const app = express();

app.use(express.static(path.join(__dirname, "views/build")));
app.use(express.static("js"));

const PORT = process.env.PORT || 8800;

MongoDBConnection();

// adding post method
app.use(express.json());

app.use(helmet());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(router);

//error middleware
app.use(errorMiddleware);
app.use(handleError);
app.listen(8800, () => {
  console.clear();
  console.log("This server is running on the port 8800");
});
