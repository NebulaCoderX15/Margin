
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
    const page= parseInt(req.query.page)||1;
    const limit = parseInt(req.query.limit)||10;
    const skip = (page-1)*limit;

   const blog = await Blog.find().skip(skip).limit(limit);

    res.status(200).json({
        message:"here are the blogs",
        page,
        limit,
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

async function updateblog(req,res){
    try {
        const blog = await Blog.findById(req.params.id);
        
        if(!blog){
            return res.status(404).json({
            message:"does not exist"       
        })
        }

        if(blog.author.toString()!==req.user.id.toString()){
             return res.status(401).json({
                message:"Not authorised"
             })
        }

        const update = await  Blog.findByIdAndUpdate(
          req.params.id,
         {   title:req.body.title,
            content:req.body.content},
            {
    returnDocument: 'after',
    runValidators: true
}
        );
        res.status(201).json({
            message:"updated",
            blog :update
        })


    } catch (error) {
          console.log(error)
        res.status(404).json({
          meesage:"internal error"
        })
    }
}


async function deleteblog(req,res) {
    try {
        const blog = await Blog.findById(
            req.params.id
        );

        if(!blog){
            return res.status(404).json({
                message:"blog does not exist"
            });
        }

        if(req.user.id.toString() !==blog.author.toString()){
            return res.status(400).json({
                message:"Not authorised"
            });
        }

        await Blog.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message:"deleted",
          
        });
        
    } catch (error) {
        console.log(error)

        res.status(400).json({
            message:"internal fault"
        })
    }
    
}

export default {createblog,getallblog,getblog,updateblog,deleteblog};
