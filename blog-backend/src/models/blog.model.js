import mongoose from 'mongoose'
import User from './auth.model.js'


const blog =  new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:User
    }},

       {timestamps:true}
    
);


const Blog = mongoose.model("Blog",blog);


export default  Blog; 