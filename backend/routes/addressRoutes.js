import express from 'express'
import { getAddresses, saveAddress } from '../controller/addressController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect)
router.post('/add' , saveAddress)
router.get('/:userId' , getAddresses )

export default router 