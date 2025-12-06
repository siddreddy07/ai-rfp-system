import { generateObject } from "ai"
import { rfpSchema } from "../schemas/ZodSchema.js"
import { google } from "@ai-sdk/google"
import { Rfp } from "../models/rfp.model.js"
import { Vendor } from "../models/vendor.model.js"



export const airfp = async(req,res)=>{

    try {
        
        const {data} = req.body

        console.log("Data : ",data)

        if(data){

            const {object} = await generateObject({
                model:google("gemini-2.5-flash"),
                schema:rfpSchema,
                prompt:`
                    You are an AI assistant that generates an RFP object.
                 Pick the category automatically from these vendor categories: IT Hardware & Software, Furniture, Electronics, Services.
        - Include realistic values for title (make it shorter always the title must be max of 2-3 words only), budget (INR only) , deliveryTime, paymentTerms, and optional warranty.
        - Include 2–5 items in the items array, each with name, specs (should be properly as user required), and quantity.
        Detect the currency from the user input (INR, USD, etc.).

Keep the number formatting exactly as given (don’t auto-convert).

Prefix the amount with the correct symbol (₹ for INR, $ for USD, etc.).

Treat the budget as a string to preserve formatting like commas.

User Request : ${data}`
            }) 

            console.log("AI Response : ",object)

            return res.status(200).json({success:true,message:"Data recieved successfully !",rpfData:object})
        }
        else{
            return res.status(401).json({success:false,message:"Data Missing"})
        }
        

    } catch (error) {
        console.error("Error inside addrfp : ",error.message)
        return res.status(500).json({success:false,message:"Internal Server Error"})
        
    }

}


export const addrfp = async(req,res)=>{

    try {

        const {data} = req.body
        if(data){
            console.log("Data : ",data)
            const rfpdata = new Rfp(data)
            await rfpdata.save()
            return res.status(200).json({success:true,message:"Saved Successfully",rfpId:rfpdata._id})
        }
        else{
            return res.status(401).json({success:false,message:"Data Missing while Saving to Db"})
        }
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }

}