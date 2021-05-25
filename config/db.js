require('dotenv').config()

  
const mongoose=require("mongoose");

function connectDB(){
    mongoose.connect(process.env.MONGOCONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    //keeping shortcut
    const connection = mongoose.connection;

    connection.once('open',()=>{
        console.log("Database Connected");
        
    }).catch(err=>{
        console.log("Connection Failed");
    })
}

module.exports=connectDB;