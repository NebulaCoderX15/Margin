import express from 'express'
import logincontroller from '../controllers/login.controller.js'

const router2 = express.Router();

router2.post('/login',logincontroller.login);
router2.post('/logout',logincontroller.logout);



export default router2;