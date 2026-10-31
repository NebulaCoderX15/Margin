import express from 'express'
import Register from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js'

 
const router = express.Router();


router.post('/register',Register.register)
router.delete('/delete',authMiddleware,Register.deleteacc);

export default router;