import mongoose from "mongoose";

let alreadyConnected = false;


export async function dbConnect() {


    if (alreadyConnected) {
    console.log("⚡ Already connected, skipping...");
    return;
  }

    try {
        
        const MONGO_URI = process.env.MONGO_DB_URL

        if(MONGO_URI){
            
                    await mongoose.connect(MONGO_URI)
                    alreadyConnected = true;
                    console.log("✅ Database Connected Successfully !")
        }

        else{
            console.log("❌ MONGO_DB_URL is missing in .env")
            return
        }
    } catch (error) {
        console.error("Error in Db connection : ",error.message)
    }
    
} 