import mongoose from "mongoose";
import { itemSchema } from "./rfp.model.js";


const proposalSchema = new mongoose.Schema({
    rfpId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Rfp"
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Vendor"
    },
    vendorScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    delivery: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    warranty: {
      type: String,
      trim: true
    },
    items: [itemSchema],
    emailReceivedAt: {
  type: Date,
  required: true
},
    attachment: {
      fileUrl: String,
      fileType: String
    },
    aiSummary:{
        type:String,
        trim:true
    }
},{timestamps:true})

export const Proposal = mongoose.model ("Proposal",proposalSchema)