import express from 'express'
import { get_assigned_vendors, send_emailto_Vendors } from '../controllers/vendor.controller.js'


const router = express.Router()



// router.get('/all-vendors',)
router.get('/assigned-vendors/:rfpid',get_assigned_vendors)

router.post('/send-email',send_emailto_Vendors)


export default router