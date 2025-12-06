import express from 'express'
import { addrfp, airfp } from '../controllers/rfp.controller.js'


const router = express.Router()


// router.get('/:id',)
router.post('/get-ai-rfp',airfp)
router.post('/add-rfp',addrfp)


export default router