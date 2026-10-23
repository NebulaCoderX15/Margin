import express from 'express'
import createblog from '../controllers/blog.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';


const router3= express.Router();


router3.post('/create',authMiddleware,createblog);


export default router3;
