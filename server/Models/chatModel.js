import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema({});

const ChatModel = mongoose.model("chat", ChatSchema);

export default ChatModel;
