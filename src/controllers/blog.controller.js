
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

async function getallblog(req,res)
{

    const blog = await Blog.find();

    res.status(200).json({
        message:"here are the blogs",
        blogs:blog
    })
}

export default {createblog,getallblog};