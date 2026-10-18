import mongoose from 'mongoose'

async function connectdb(){
    await mongoose.connect(process.env.MONGO_URL);
    console.log("database connected")
}

export default connectdb;