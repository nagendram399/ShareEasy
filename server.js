const express=require("express")
const app=express();
const path =require('path')
const cors=require('cors')
const PORT=process.env.PORT || 3000;
app.use(express.static('public'))
app.use(express.json());
const connectDB=require('./config/db');
//checking connection to database successful 
connectDB();

const corsOptions={
    origin:process.env.ALLOWED_CLIENTS.split(',')
}
app.use(cors(corsOptions));

app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');

app.use('/api/files',require('./routes/files'))

app.use('/files',require('./routes/show'));

app.use('/files/download',require('./routes/download'));

app.get('/', function(request, response){
    response.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(PORT,()=>{
    console.log(`listening in the port ${PORT}`);
})