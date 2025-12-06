import express from 'express'
import { getEmail, getproposals } from '../controllers/proposal.controller.js'

const router = express.Router()



router.get('/get-mails/:rfpId',getEmail)
router.get('/get-proposals/:rfpId',getproposals)


export default router