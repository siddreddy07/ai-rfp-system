import { generateObject } from "ai"
import { readInbox } from "../../gmailReader.js"
import { Proposal } from "../models/proposal.model.js"
import { Rfp } from "../models/rfp.model.js"
import { proposalsArraySchema, proposalSchema } from "../schemas/ZodSchema.js"
import { google } from "@ai-sdk/google"
import { success } from "zod"




export const getEmail = async (req,res) => {

    try {
        
        const {rfpId} = req.params

        console.log("RfpId : ",rfpId)

        if(!rfpId) return res.status(401).json({success:false,message:'Unable to get email data without rfpId'})


        const rfp = await Rfp.findById(rfpId).populate("vendorsSent","email createdAt")

        if(!rfp) return res.status(403).json({success:false,message:'No rfpId Associated with Found'})

            let emails =[]

         emails = rfp.vendorsSent.map(v=>v.email)

        let emailDate  = ''

        const latestProposalDate = await Proposal.findOne({rfpId})
                                            .sort({emailReceivedAt:-1})
                                            .select("emailReceivedAt _id vendorId")
        if(!latestProposalDate){
            emailDate = new Date(rfp.createdAt)
        }
        else{

            const existingProposal = await Proposal.find({rfpId})

            const existingVendorIds  = existingProposal.map(p=>p.vendorId.toString())

            console.log("Exisitng : ",existingVendorIds)

             emails = rfp.vendorsSent
                                    .filter(v=> !existingVendorIds.includes(v._id.toString()))
                                    .map(v=>v.email) 

            console.log("Emails : ",emails)

            emailDate = new Date(latestProposalDate.emailReceivedAt)
        }

        if(emails.length === 0){
                return res.status(403).json({success:false,message:'No Emails Available to pursue'})
        }

        else{
            const {success,data} = await readInbox(emails,emailDate)
    
    
            let result
    
            if(success && data.length > 0){
                    // data.forEach(el1 => {
                    //     const match = rfp.find(el2 => el2.email === el1.email)
                    //     if(match){
                    //         result.push(match.id)
                    //     }
                    // });
                    result = data
    
                    console.log("Original Object data for messages : ",data)
    
                    const {object} = await generateObject({
                    model:google("gemini-2.5-flash"),
                    schema:proposalsArraySchema,
                    prompt:`You will receive:
    
    - formattedEmails = ${data}  
    - rfp = ${rfp.vendorsSent} (rfp.vendorsSent includes _id, email, createdAt)
    
    Task: Extract proposals from emails as a JSON array matching proposalSchema.
    
    Rules:
    
    1. **Validate:** Skip empty/null emails or missing email/body.  
    2. **Match Vendors:** Find email → rfp.vendorsSent by email. If none, vendorId = null. One proposal per unique email.  
    3. **Fields:**  
       - rfpId → rfp._id (valid ObjectId)  
       - vendorId → matched vendor _id or null  
       - vendorScore → 0–100 (estimate if missing)  
       - delivery → exact from email, else ""  
       - price → numeric from email (₹5,70,000 → 570000), else ""  
       - warranty → as stated, else ""  
       - items → [{ name, specs, quantity }] from email  
       - emailReceivedAt → timestamp  
       - aiSummary → 2–3 factual lines summarizing items, total price, delivery, warranty, vendorScore  
    5. **Output Rules:**  
       - Do not invent fields/items  
       - Do not guess numbers if unclear → ""  
       - Do not merge multiple emails  
       - Skip unmatched/empty entries  
       - ObjectId fields = valid 24-char hex  
       - price & quantity = numbers  
       - delivery & warranty = exact from email
    
    `
                }) 
    
                if(object || object.length > 0){
                    const inserted = await Proposal.insertMany(object);
                    const ids = inserted.map(doc => doc._id);
    
                    const proposals = await Proposal.find({_id:{$in:ids}})
                                                    .populate("rfpId vendorId")
    
                    console.log('Ai proposals: ', object);
                    return res.status(200).json({success:true,message:`${result.length} Vendors replied for your Proposal ${rfp.title}`,proposals})
                }
    
                console.log("Object : ",object)
    
                return res.status(402).json({success:false,message:'No reply from Vendor(s)'})
                
            }
            
            return res.status(402).json({success:false,message:'No data from gmail Vendor(s)'})
        }
        
    } catch (error) {
        console.error('Error inside getEMail Controller : ',error.message)
        return res.status(500).json({success:false,message:'Internal Server Error'})
    }

}



export const getproposals = async(req,res)=>{

    try {

        const {rfpId} = req.params

        console.log("Rfid :",rfpId)

        const proposals = await Proposal.find({rfpId}).populate("rfpId vendorId")
        console.log("Proposals : ",proposals)

        if(!proposals){
            return res.status(400).json({success:false,message:'No Propsoals Found'})
        }

        else{
            console.log("Porpsoal : ",proposals.length)
            return res.status(200).json({success:true,message:`${proposals.length} Vendor(s) replied to Your proposal`,proposals})
        }

    } catch (error) {

        console.error("Error inside GetProposal : ",error.message)
        return res.status(500).json({success:false,message:'Internal Server Error'})
        
    }

}