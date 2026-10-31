import User from '../models/auth.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


async function register(req,res){
    const {username,email, password, role="user"}= req.body;
    
     const result = await User.findOne({
        $or:[
            {username},
            {email}
        ]
     });

     if(result){
        return res.status(400).json({
            message:"user exist "
        })
     };


    const hash = await bcrypt.hash(password,10);

    const  user = await User.create({
        username,
        email,
        password:hash,
        role
    });

    const token = jwt.sign({
      id:user._id,
      role:user.role

    },process.env.JWT_SECRET);

    res.cookie("token", token);

    
    res.status(201).json({
        message: "User created successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
             

        },
        
    });
}

async function deleteacc(req,res){
    try{
        const id = req.user.id;

    const result = await User.findByIdAndDelete(
        id
    )

    res.status(200).json({
        message:"account deleted successfully",
        result
    })
    }

    catch(error){
        console.log(error);

        res.status(500).json({
            message:"internal error"
        })
    }
    
}

export default {register,deleteacc};
