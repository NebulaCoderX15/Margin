import 'dotenv/config';
import app from './src/app.js'
import connectdb from './src/db/db.js';

connectdb();

app.listen(3000,()=>{
  console.log('Server running at port 3000');
});