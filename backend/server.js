import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { dbConnect } from './src/utils/dbConnect.js'

import rfprouter from './src/routes/rfp.routes.js'
import vendorrouter from './src/routes/vendors.routes.js'
import proposalrouter from './src/routes/proposal.routes.js'
import comparerouter from './src/routes/comparison.routes.js'

dotenv.config({ path: ".env.local" })


const app = express()

const PORT = process.env.PORT || 8000


app.use(express.json());


app.use(cors());


app.get("/",(req,res)=>{
    res.send("Hello World")
})



app.use('/api/rfp',rfprouter)
app.use('/api/vendor',vendorrouter)
app.use('/api/proposal',proposalrouter)
app.use('/api/compare',comparerouter)

app.listen(PORT,async()=>{
    console.log("Server Running on PORT : ",PORT)
    await dbConnect()
})