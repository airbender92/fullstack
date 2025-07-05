import mongoose from "mongoose";
import {config} from 'dotenv'

config();

const connectDB = async() => {
    try{
        const uri = process.env.MONGODB_URI as string;
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch(error) {
        console.error('Error connecting to MongoDB: ', error);
        process.exit(1);
    }
}

export default connectDB;