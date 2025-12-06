import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config({path:".env.local"})

const transporter = nodemailer.createTransport({
    host:process.env.GMAIL_HOST,
    port:587,
    secure:false,
    auth:{
        user:process.env.GMAIL_USER,
        pass:process.env.GMAIL_APP_PASS
    }
})

export async function sendMail(toEmail, subject, htmlContent, rfpData = {}) {
  try {
    
    const info = await transporter.sendMail({
        from:process.env.GMAIL_USER,
        to:toEmail,
        subject,
        html:htmlContent
    })

    console.log(`Email sent to ${toEmail}`, info);
    return info.messageId;
  } catch (error) {
    console.error(`Error sending email to ${toEmail}:`, error);
    return null;
  }
}
