import imaps from "imap-simple";
import { simpleParser } from "mailparser";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const config = {
  imap: {
    user: "hrxreddy007@gmail.com",
    password: process.env.GMAIL_APP_PASS,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
  }
};

function cleanHTML(html) {
  if (!html || typeof html !== 'string') return '';

  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');

  html = html.replace(/<blockquote[\s\S]*?<\/blockquote>/gi, '');
  html = html.replace(/<div class="gmail_quote"[\s\S]*?<\/div>/gi, '');

  html = html.replace(/<\/?[^>]+(>|$)/g, '');

  html = html.replace(/[*_]+/g, '');

  html = html.replace(/\r\n|\r|\n/g, ' ').replace(/\s+/g, ' ').trim();

  return html;
}


export async function readInbox(allowedSenders, emailDate) {
  try {
    const connection = await imaps.connect({ imap: config.imap });
    await connection.openBox("INBOX");

    const bumpedDate = new Date(emailDate.getTime() + 1000);

    const imapDate = bumpedDate.toISOString();

    const searchCriteria = ["ALL", ["SINCE", imapDate]];
    const fetchOptions = { bodies: [""], markSeen: false };

    const messages = await connection.search(searchCriteria, fetchOptions);

    let filteredEmails = [];

    for (const message of messages) {
      const full = message.parts?.[0]?.body;
      if (!full) continue;

      const parsed = await simpleParser(full);

      const from = parsed.from?.value?.[0]?.address || null;
      if (!from) {
        console.warn("⚠️ No sender address found, skipping");
        continue;
      }

      if (!allowedSenders.includes(from)) continue;

      filteredEmails.push({
        email: from,
        subject: parsed.subject || "",
        html: cleanHTML(parsed.html) || "",
        date: parsed.date || "",
        emailReceivedAt:parsed.date || ""
      });
    }

    connection.end();

    return { success: true, data: filteredEmails };
  } catch (error) {
    console.error("❌ IMAP Read Error:", error.message);
    return { success: false, error: error.message };
  }
}
