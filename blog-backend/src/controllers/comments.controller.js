import Comment from '../models/comments.model.js';
import Blog from '../models/blog.model.js';

async function addComment(req, res)  {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content || !content.trim()) {
            return res.status(400).json({
                message: 'Comment cannot be empty'
            });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                message: 'Blog not found'
            });
        }

        const comment = await Comment.create({
            blog: id,
            user: userId,
            content: content.trim()
        });

        return res.status(201).json({
            message: 'Comment added successfully',
            comment
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


async function getComments(req, res) {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                message: 'Blog not found'
            });
        }

        const comments = await Comment.find({ blog: id })
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: comments.length,
            comments
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

async function updateComment(req, res) {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({
                message: 'You cannot update this comment'
            });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content: content.trim() },
             { returnDocument: 'after' } 
        );

        return res.status(200).json({
            message: 'Comment updated successfully',
            comment: updatedComment
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

async function deleteComment(req, res) {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: 'Comment not found'
            });
        }

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({
                message: 'You cannot delete this comment'
            });
        }

        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({
            message: 'Comment deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


export default {
    addComment,
    getComments,
    updateComment,
    deleteComment
};