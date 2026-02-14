import express from "express"
import cors from "cors"

const app = express()

app.use(cors())


app.get('/', (req, res)=>{
    res.send('Hello world')
})

app.listen(4000, ()=>{
    console.log('Server started at http://localhost:4000/')
})