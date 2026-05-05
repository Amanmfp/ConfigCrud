"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const uri = process.env.MONGO_URI ?? "mongodb+srv://amanmfp025_db_user:tKO5rny9P8Gk3nZ1@cluster0.lzoivdw.mongodb.net/";
    await mongoose_1.default.connect(uri);
    console.log("MongoDB connected");
};
exports.connectDB = connectDB;
