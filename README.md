# AI-Powered RFP Management System


An intelligent procurement platform that automates the entire RFP (Request for Proposal) lifecycle using AI — from creating structured RFPs from plain English to parsing vendor replies and recommending the best proposal.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Setup](#project-setup)
- [Database Schemas](#database-schemas)
- [API Endpoints](#api-endpoints)
- [Controllers & Email Handling](#controllers--email-handling)
- [Zod Validation Schemas](#zod-validation-schemas)
- [Decisions & Assumptions](#decisions--assumptions)
- [Demo Video](#demo-video)
- [Known Limitations & Next Steps](#known-limitations--next-steps)

---

## Project Overview

This full-stack application drastically reduces manual work in procurement by automating the RFP process:

1. Write RFP requirements in natural language → AI converts to structured document  
2. Select up to 3 vendors → RFP sent automatically via email  
3. Vendors reply by email → AI parses unstructured responses into structured proposals  
4. AI compares all proposals side-by-side and recommends the winner with clear reasoning  

**Outcome:** 80–90% faster RFP cycles with consistent, unbiased evaluation.

---

## Features

- Natural language to structured RFP creation (AI-powered)
- Built-in vendor directory (pre-seeded)
- Automatic email sending of RFPs (Gmail + Nodemailer)
- Automatic email fetching & AI parsing of vendor proposals using IMAP and Mailparser
- Structured proposal storage with Zod validation
- AI-driven proposal comparison & winner recommendation
- Clean, responsive UI with Shadcn + Tailwind

---

## Tech Stack

| Layer         | Technology                                      |
|---------------|-------------------------------------------------|
| Frontend      | React.js, Tailwind CSS, Shadcn UI,  Zustand            |
| Backend       | Node.js, Express.js                             |
| Database      | MongoDB + Mongoose                              |
| Email (Send)  | Nodemailer + Gmail SMTP                         |
| Email (Receive)| imap-simple + Mailparser                        |
| AI            | Vercel AI SDK (OpenAI / Anthropic compatible)   |
| Validation    | Zod                                             |

---

## Project Setup

### Prerequisites
- Node.js ≥ v18
- MongoDB (local or Atlas)
- Gmail account with **App Password** enabled
- Vercel AI / OpenAI / Anthropic API key

### Installation

```bash
git clone https://github.com/yourusername/ai-rfp-system.git
cd ai-rfp-system

# Backend
cd backend
npm install
create .env.local   # then fill in your credentials
go through .ev.example


# Frontend
cd ../frontend
npm install
```

### Environment Variables (`backend/.env.local`)

```env
//Inside backend


MONGO_DB_URL=

GOOGLE_GENERATIVE_AI_API_KEY=

GMAIL_APP_PASS=
GMAIL_USER=
GMAIL_HOST=
PORT=8000



# IMAP_USER and GMAIL_USER must be same

IMAP_USER= 
IMAP_HOST=
IMAP_PORT=
```

### Run Locally

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

frontend → http://localhost:5173
backend → http://localhost:8000

---

## Database Schemas

### Vendor
```ts
{
  name: string;
  email: string;
  phone: string;
  category: string;
  rating: number;
  createdAt: Date;
}
```

### RFP
```js
{
  title: string;
  category: string;
  budget: number;
  deliveryTime: string;
  paymentTerms: string;
  warranty?: string;
  items: { name: string; specs: string; quantity: number }[];
  assignedVendors: ObjectId[];
  status: "draft" | "sent" | "evaluating" | "completed";
  createdAt: Date;
}
```

### Proposal
```js
{
  rfpId: ObjectId;
  vendorId: ObjectId;
  price: number;
  delivery: string;
  warranty?: string;
  items: { name: string; specs: string; quantity: number; unitPrice?: number }[];
  vendorScore?: number;
  aiSummary?: string;
  emailReceivedAt: Date;
  rawEmailId: string;
}
```

### Comparison
```js
{
  rfpId: ObjectId;
  proposals: ObjectId[];
  winnerVendorId?: ObjectId;
  runnerupVendorId?: ObjectId;
  decisiveFactors: string;
  overallSummary?: string;
  createdAt: Date;
}
```

---

## API Endpoints

| Method | Endpoint                     | Description                              |
|--------|------------------------------|------------------------------------------|
| POST   | `/api/rfp/get-ai-rfp`        | Generate RFP from natural language       |
| POST   | `/api/rfp/add-rfp`           | Add a new RFP                            |
| GET    | `/api/comparison-result/:rfpId` | Compare proposals for an RFP           |
| GET    | `/api/getcomparison-result/:rfpId` | Get saved comparison result          |
| GET    | `/api/get-mails/:rfpId`      | Fetch emails from vendors                |
| GET    | `/api/get-proposals/:rfpId`  | List parsed proposals                     |
| GET    | `/api/assigned-vendors/:rfpid` | Get vendors assigned to an RFP        |
| POST   | `/api/send-email`            | Send RFP to assigned vendors             |

---

## Controllers & Email Handling

- IMAP + Mailparser used to fetch vendor emails
- `readInbox` function filters emails by allowed senders and cleans HTML content
- Controllers handle routing logic for RFP, proposals, vendors, and comparisons

---

## Zod Validation Schemas

- `itemSchema`, `rfpSchema`, `proposalSchema`, `proposalsArraySchema`, `comparisonSchema`
- Ensures consistent validation for all incoming RFPs, proposals, and comparison data

---

## Decisions & Assumptions

- Max 3 vendors per RFP
- Only email body parsed automatically (attachments flagged)
- Gmail used for simplicity
- Single-user system
- AI summaries provide keyword-wise insights (e.g., price difference %, delivery time, etc.)

---

## Demo Video

[Watch Full Demo on Google Drive](https://drive.google.com/file/d/1NLEPU94coNpPGxMFpwYZPGl0uLzkb0_n/view?usp=sharing)

---

Made with love and AI – December 2025

