const mongoose=require('mongoose')
mongoose.connect("mongodb://localhost:27017/user_management_system")


const express=require('express')
const app=express();


const nocache = require('nocache')
app.use(nocache())

// for user routes
const userRoute = require('./routes/userRoute');
app.use('/',userRoute)

// for admin routes
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute);

app.listen(4000,()=>{
    console.log("server is running...@http://localhost:3000/")

})