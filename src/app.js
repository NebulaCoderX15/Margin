import express from 'express'
import router from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import router1 from './routes/login.route.js'
import router3 from './routes/blog.route.js'

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth',router);
app.use('/api/auth',router1);
app.use('/api/auth',router3);


export default app