import mongoose from "mongoose";


const vendorSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String},
    contactPerson:String,
    phone:String,
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
},{timestamps:true})

export const Vendor = mongoose.model("Vendor",vendorSchema)
