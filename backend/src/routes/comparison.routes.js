import express from 'express'
import { compare, getCompare } from '../controllers/comparison.controller.js'



const router = express.Router()



router.get('/comparison-result/:rfpId',compare)
router.get('/getcomparison-result/:rfpId',getCompare)



export default router