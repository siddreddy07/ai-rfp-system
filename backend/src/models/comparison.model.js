import mongoose from "mongoose";


const comparisonSchema = new mongoose.Schema({
  rfpId: { type: mongoose.Schema.Types.ObjectId, ref: "RFP", required: true },
  proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Proposal", required: true }],
  winnerVendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  runnerupVendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  decisiveFactors:{type:String}
}, { timestamps: true });

export const Comparison =  mongoose.model("Comparison", comparisonSchema);
