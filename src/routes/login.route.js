import express from 'express'
import login from '../controllers/login.controller.js'

const router1 = express.Router();

router1.post('/login',login);



export default router1;