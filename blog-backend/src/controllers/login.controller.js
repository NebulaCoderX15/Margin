import User from '../models/auth.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

async function login(req, res) {
    const { username, email, password } = req.body;

    if (!password || (!username && !email)) {
        return res.status(400).json({
            message: 'Username/email and password are required'
        });
    }

    try {
        const user = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role

        }, process.env.JWT_SECRET);

        res.cookie("token", token);



        return res.status(200).json({
            message: 'login done',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

async function logout(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
    
       return res.status(200).json({
        message: "Logged out successfully"
    });
}

export default { login, logout };