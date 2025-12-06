// seedVendors.js
import mongoose from "mongoose";
import { Vendor } from "./src/models/vendor.model.js";
import dotenv from 'dotenv'

dotenv.config({ path: ".env.local" })

const MONGO_URI = process.env.MONGO_DB_URL;

console.log("Mongo_url : ",MONGO_URI)


async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Database Connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  }
}

const vendors = [
  { name: "TechHub Computers", email: "hrxsiddharth@gmail.com", phone: "9000000001", category: "IT Hardware & Software", rating: 4.6 },
  { name: "CompStore", email: "siddharthreddy627@gmail.com", phone: "9000000002", category: "IT Hardware & Software", rating: 4.5 },
  { name: "NetGear Systems", email: "contact@netgear.com", phone: "9000000003", category: "IT Hardware & Software", rating: 4.4 },

  { name: "CozyOffice Furnitures", email: "pearlsmart007@gmail.com", phone: "9000000020", category: "Furniture", rating: 4.5 },
  { name: "WorkSpace Interiors", email: "contact@workspace.com", phone: "9000000021", category: "Furniture", rating: 4.4 },
  { name: "ComfortZone Furniture", email: "contact@comfortzone.com", phone: "9000000022", category: "Furniture", rating: 4.5 },

  { name: "TechWorld", email: "contact@techworld.com", phone: "9000000040", category: "Electronics", rating: 4.5 },
  { name: "VisionElectro", email: "contact@visionelectro.com", phone: "9000000041", category: "Electronics", rating: 4.4 },
  { name: "DeviceMart", email: "contact@devicemart.com", phone: "9000000042", category: "Electronics", rating: 4.3 },

  { name: "Bright Solutions", email: "contact@brightsolutions.com", phone: "9000000050", category: "Services", rating: 4.6 },
  { name: "OfficeCare Services", email: "contact@officecare.com", phone: "9000000051", category: "Services", rating: 4.5 },
  { name: "QuickAssist", email: "contact@quickassist.com", phone: "9000000052", category: "Services", rating: 4.4 },
  { name: "TeamPro", email: "contact@teampro.com", phone: "9000000053", category: "Services", rating: 4.5 },
];

async function seed() {
  await connectDB();

  try {
    await Vendor.deleteMany({});
    console.log("🗑 Cleared old vendors");

    await Vendor.insertMany(vendors);
    console.log("✅ Seeded vendors successfully!");
  } catch (err) {
    console.error("❌ Error seeding vendors:", err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
