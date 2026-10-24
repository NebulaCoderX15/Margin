
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


async function getblog(req,res){

    try{ const blog = await Blog.findById(
      req.params.id
    )

    
    res.status(200).json({
        message:"here are the blog",
        blog:blog,});
    }
    catch(error){
        return res.status(404).json({
            error
        })
    }



    
}

export default {createblog,getallblog,getblog};