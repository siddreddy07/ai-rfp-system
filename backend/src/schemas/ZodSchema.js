import z from 'zod'



export const itemSchema = z.object({
    name:z.string(),
    specs:z.string(),
    quantity:z.number()
})


export const rfpSchema = z.object({
    title:z.string(),
    category:z.string(),
    budget:z.number(),
    deliveryTime:z.string(),
    paymentTerms:z.string(),
    warranty:z.string().optional(),
    items:z.array(itemSchema)
})



export const proposalSchema = z.object({
  rfpId: z.string().describe("ObjectId of the RFP"),
  vendorId: z.string().describe("ObjectId of the vendor"),
  vendorScore: z.number().describe("Score given to the vendor 1-100"),
  delivery: z.string().min(1).describe("Delivery timeline"),
  price: z.number().min(0).describe("Proposed price"),
  warranty: z.string().optional().describe("Warranty details, if any"),
  items:z.array(itemSchema),
  emailReceivedAt:z.string().datetime().describe('Email recieved Date'),
  aiSummary: z.string().optional().describe("AI-generated summary of proposal in upto proper keywords wise like 2.9 % lower price ,, liek that"),
})

export const proposalsArraySchema = z.array(proposalSchema);

export const comparisonSchema = z.object({
  rfpId: z.string().describe("ObjectId of the RFP"),
  proposals: z.array(z.string()).min(1).describe("Array of Proposal ObjectIds"),
  winnerVendorId: z.string().optional().describe("ObjectId of the winning vendor"),
  runnerupVendorId: z.string().optional().describe("ObjectId of the runner-up vendor"),
  decisiveFactors: z.string().optional().describe("Reasoning/rationale for winner selection")
});