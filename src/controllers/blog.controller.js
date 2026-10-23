import Blog from '../models/blog.model.js'



async function createblog(req,res){

    const {title, content}= req.body;

    const blog = await Blog.create({
        title:title,
        content:content,
        author:req.user.id,
        
    })


    res.status(200).json({
        message:"blog created",
        title:blog.title,
        author:blog.author,
        
    })


}



export default createblog;