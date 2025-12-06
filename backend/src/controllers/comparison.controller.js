import { generateObject } from "ai"
import { Proposal } from "../models/proposal.model.js"
import { google } from "@ai-sdk/google"
import { Comparison } from "../models/comparison.model.js"
import { comparisonSchema } from "../schemas/ZodSchema.js"



export const compare = async(req,res)=>{

    try {

        const {rfpId} = req.params

        const proposals = await Proposal.find({rfpId})
                                        .populate('rfpId vendorId')

        if(!proposals || proposals.length < 2){
            return res.status(401).json({success:false,message:'(Less than 2 )/ No Proposals'})
        }

        const {object} = await generateObject({
            model:google("gemini-2.5-flash"),
            schema:comparisonSchema,
            prompt:`You are an AI assistant that analyzes proposals for an RFP and outputs the final result.

           Proposals :  ${proposals}

Input: An array of proposals for a single RFP. Each proposal has:
- rfpId
- vendorId
- vendorScore (1-100)
- delivery (timeline)
- price
- warranty (optional)
- items [{name, specs, quantity}]
- emailReceivedAt
- aiSummary (optional)

Task:
From these proposals, determine:
1. winnerVendorId: vendorId with highest score (tie-breaker: lower price, then faster delivery)
2. runnerupVendorId: second-best vendor
3. decisiveFactors: short reasoning for winner selection
4. proposals: array of all vendorIds
5. rfpId: same as input`
        })
        
        if(object){
            const comparison = new Comparison(object)
            await comparison.save()

            const proposalIds = comparison.proposals

            console.log("Comparison Saved : ",comparison)

            const proposals = await Proposal.find({_id:{$in:proposalIds}})
                                            .populate("vendorId")


            return res.status(200).json({success:true,message:'Comparison Crafted Successfully !',comparison,proposals})

        }

    } catch (error) {
        console.error('Error Inside COmpare controller : ',error.message)
        return res.status(500).json({success:false,message:'Error inside compare '})
    }

}

export const getCompare = async(req,res)=>{

    try {
        
        const {rfpId} = req.params

        console.log("RFPID : ",rfpId)

        const comparison = await Comparison.findOne({rfpId})

        if(!comparison) {
            return res.status(402).json({success:false,message:'No Comparison Result Found'})
        }

        const proposalIds = comparison.proposals

        console.log("Proposals: ",comparison)

        const proposals = await Proposal.find({_id:{$in:proposalIds}})
                                        .populate('vendorId')


        return res.status(200).json({success:true,message:'Comparison Crafted Successfully !',comparison,proposals})


    } catch (error) {
        console.error('Error Inside getCOmpare controller : ',error.message)
        return res.status(500).json({success:false,message:'Error inside get compare '})
    }

}