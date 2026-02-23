import mongoose from "mongoose";
import 'dotenv/config'

export const connectDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("mongoDB connected ho gaya")
    } catch (error) {
        console.error("Error in connecting database" , error)
    }
}