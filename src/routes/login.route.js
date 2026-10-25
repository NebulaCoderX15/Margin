import express from 'express'
import login from '../controllers/login.controller.js'

const router2 = express.Router();

router2.post('/login',login);



export default router2;