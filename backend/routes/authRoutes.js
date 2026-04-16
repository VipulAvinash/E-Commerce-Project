import express from 'express'
import { singupUser,loginUser } from '../controller/authController.js'

 const router = express();

router.post('/signup' , singupUser)
router.post('/login',loginUser)
export default router