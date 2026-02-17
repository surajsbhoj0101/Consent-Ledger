import express from "express"
import cors from "cors"
import connectDB from "./config/db.js";

const app = express()

app.use(cors())

connectDB();

app.get('/', (req, res)=>{
    res.send('Hello world')
})

app.listen(4000, ()=>{
    console.log('Server started at http://localhost:4000/')
})