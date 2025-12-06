import { Rfp } from "../models/rfp.model.js"
import { Vendor } from "../models/vendor.model.js"
import { sendMail } from "../utils/emailService.js";


function generateRfpHtml(rfpData) {
  const {
    title,
    category,
    budget,
    deliveryTime,
    paymentTerms,
    warranty,
    items
  } = rfpData;

  // Professional color scheme
  const colors = {
    primary: "#1a73e8",    // Google Blue
    primaryLight: "#e8f0fe",
    accent: "#34a853",     // Success green (optional)
    dark: "#202124",
    gray: "#5f6368",
    lightGray: "#f1f3f4",
    border: "#dadce0"
  };

  const formatCurrency = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

  const itemsHtml = items
    .map(
      (item, index) => `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e0e0e0; font-size: 14px; color: ${colors.dark};">
          ${index + 1}
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e0e0e0; font-size: 14px; color: ${colors.dark}; font-weight: 500;">
          ${item.name}
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e0e0e0; font-size: 14px; color: ${colors.gray};">
          ${item.specs.replace(/\n/g, "<br>")}
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e0e0e0; font-size: 14px; text-align: center; color: ${colors.dark};">
          ${item.quantity}
        </td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RFP - ${title}</title>
</head>
<body style="margin:0; padding:0; background:#f9f9fb; font-family: Arial, sans-serif;">
  
  <!-- Wrapper Table -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9fb; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <!-- Main Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: ${colors.primary}; padding: 30px 40px; text-align: center;">
              <h1 style="margin:0; color: white; font-size: 28px; font-weight: 500; letter-spacing: -0.5px;">
                Request for Proposal (RFP)
              </h1>
              <p style="margin: 12px 0 0; color: rgba(255,255,255,0.95); font-size: 18px;">
                ${title}
              </p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Key Details Grid -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom: 24px;">
                    <h2 style="margin: 0 0 20px; color: ${colors.dark}; font-size: 20px; border-left: 4px solid ${colors.primary}; padding-left: 16px;">
                      Project Overview
                    </h2>
                    
                    <table width="100%" style="font-size: 15px; line-height: 1.6;">
                      <tr><td style="padding: 10px 0; color: ${colors.gray};"><strong>Category</strong></td><td style="padding: 10px 0; color: ${colors.dark};">${category}</td></tr>
                      <tr><td style="padding: 10px 0; color: ${colors.gray};"><strong>Budget Range</strong></td><td style="padding: 10px 0; color: ${colors.dark}; font-weight: 600; font-size: 16px;">${formatCurrency(budget)}</td></tr>
                      <tr><td style="padding: 10px 0; color: ${colors.gray};"><strong>Expected Delivery</strong></td><td style="padding: 10px 0; color: ${colors.dark};">${deliveryTime}</td></tr>
                      <tr><td style="padding: 10px 0; color: ${colors.gray};"><strong>Payment Terms</strong></td><td style="padding: 10px 0; color: ${colors.dark};">${paymentTerms}</td></tr>
                      <tr><td style="padding: 10px 0; color: ${colors.gray};"><strong>Warranty Required</strong></td><td style="padding: 10px 0; color: ${colors.dark};">${warranty}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Items Table -->
              <h2 style="margin: 32px 0 16px; color: ${colors.dark}; font-size: 20px; border-left: 4px solid ${colors.primary}; padding-left: 16px;">
                Required Items / Scope of Supply
              </h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 0; border: 1px solid ${colors.border}; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background: ${colors.primaryLight};">
                    <th style="padding: 16px; text-align: left; color: ${colors.primary}; font-weight: 600; font-size: 14px;">#</th>
                    <th style="padding: 16px; text-align: left; color: ${colors.primary}; font-weight: 600; font-size: 14px;">Item Name</th>
                    <th style="padding: 16px; text-align: left; color: ${colors.primary}; font-weight: 600; font-size: 14px;">Specifications</th>
                    <th style="padding: 16px; text-align: center; color: ${colors.primary}; font-weight: 600; font-size: 14px;">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <!-- Footer Call to Action -->
              <div style="margin-top: 40px; padding: 24px; background: ${colors.primaryLight}; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 16px; color: ${colors.dark}; font-size: 15px;">
                  We invite you to submit your best quotation before the deadline.
                </p>
                <a href="mailto:hrxreddy007@gmail.com" style="display: inline-block; padding: 12px 32px; background: ${colors.primary}; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
                  Submit Your Proposal →
                </a>
              </div>
              
              <p style="margin-top: 32px; font-size: 13px; color: #888; text-align: center;">
                This is an automated RFP generated on ${new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}.
              </p>
              
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}



export const get_assigned_vendors = async(req,res)=>{

    try {
        
        const {rfpid} = req.params

        if(!rfpid) return res.status(401).json({success:false,message:'rfpid reuqired'})

            const rfpdata = await Rfp.findById(rfpid)

            if(!rfpdata) return res.status(401).json({success:false,message:'No rfp data Found'})

            const assgined_vendors = await Vendor.find({category:rfpdata.category})

            return res.status(200).json({success:true,rfpdata,vendors:assgined_vendors})


    } catch (error) {
        console.log("Error inside Assigned Vendors : ",error.message)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }

}



export const send_emailto_Vendors = async(req,res)=>{

    try {

        const data = req.body

        const {rfpId,vendors} = data

        if(!data || !rfpId || vendors.length === 0){
                return res.status(401).json({success:false,message:'Unable to send mails right now. Try Again Later'})
        }

        const isrfp = await Rfp.findById(rfpId)
        
        if(isrfp){

            const vendorsEmails = await Vendor.find({_id:{$in:vendors}},{email:1,_id:1})

            const successfulVendorIds = [];

            for(const vendor of vendorsEmails){
                const htmlContent = generateRfpHtml(isrfp)

                const emailId = await sendMail(vendor.email,"RFP Details",htmlContent,isrfp)
                if(emailId){
                    successfulVendorIds.push(vendor._id);
                }
            }

               if (successfulVendorIds.length > 0) {
              isrfp.vendorsSent.push(...successfulVendorIds);
             await isrfp.save();
                }


            console.log("Vendros Emails : ",vendorsEmails)

            return res.status(200).json({success:true,message:`${successfulVendorIds.length} email(s) send successfully !`})

        }

    } catch (error) {
        console.log("Error inside send Email controller : ",error.message)
           return res.status(500).json({success:false,message:"Internal Server Error"})

    }

}