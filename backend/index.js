const express=require('express');
const app=express();
require('dotenv').config();
const cors=require('cors');
const rootRouter=require('./routes/index');
const { connectDB }=require('./db/database');

app.use(cors());
app.use('/api/v1',rootRouter);

async function startServer(){
    try {
        await connectDB(process.env.DATABASE_URI);
        console.log('Connected to Database');
        app.listen(5000,()=>console.log('listening on port 5000.....'));
    } catch (error) {
        console.log(error);
    }
}

startServer();
