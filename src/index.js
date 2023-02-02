const express = require('express')
const morgan = require('morgan')
const app =  express()
const router =require("./routes/index")
const port = "8080"


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
router(app)


app.listen(port, ()=>{
    console.log(`server running at port ${port}`)
    })
    