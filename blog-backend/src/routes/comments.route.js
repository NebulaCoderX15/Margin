import express from 'express';
import comments from '../controllers/comments.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';


const router4 = express.Router();

router4.post('/:id/comments', authMiddleware, comments.addComment);

router4.get('/:id/comments', comments.getComments);

router4.patch('/comments/:commentId', authMiddleware, comments.updateComment);

router4.delete('/comments/:commentId', authMiddleware, comments.deleteComment);


export default router4;