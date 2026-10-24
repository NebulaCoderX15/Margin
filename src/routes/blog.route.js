import express from 'express'
import blogcontroller from '../controllers/blog.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';


const router3= express.Router();


router3.post('/create',authMiddleware,blogcontroller.createblog);
router3.get('/getall',blogcontroller.getallblog);
router3.get('/getblog/:id',blogcontroller.getblog);
router3.patch('/updateblog/:id',authMiddleware,blogcontroller.updateblog);





export default router3;
