import express from 'express'
import router from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import router1 from './routes/login.route.js'

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth',router);
app.use('/api/auth',router1);


export default app