import mongoose from "mongoose";


export const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specs: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const rfpSchema = new mongoose.Schema({
            title:{type:String,required:true},
            category:{type:String,required:true},
            budget:{type:Number,required:true},
            deliveryTime: { type: String, required: true },
    paymentTerms: { type: String, required: true },
    warranty: { type: String },
    items: [itemSchema],
    vendorsSent: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }
  ],
},{timestamps:true})


export const Rfp = mongoose.model("Rfp",rfpSchema)