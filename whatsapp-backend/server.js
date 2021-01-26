// importing
import express from "express"
import mongoose from "mongoose"
import Messages from "./dbMessages.js"
import Pusher from "pusher"
import cors from 'cors'

//app config
const app = express()
const port = process.env.PORT || 9000
const pusher = new Pusher({
    appId: "1134518",
    key: "50ef11eb9b8fdd0c8a7c",
    secret: "002455684c22f5b1280b",
    cluster: "ap2",
    useTLS: true
  });

//middlewares
app.use(express.json());

app.use(cors())

/*
to use remove app.use(cors())

app.use((req,res,next)=>{
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("access-control-allow-header","*");
    next();
});*/

//DB config
//pass:lLT3u1GX6XaCuADE
mongoose.connect('mongodb+srv://admin:lLT3u1GX6XaCuADE@cluster0.24cuc.mongodb.net/whatsappdb?retryWrites=true&w=majority',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.once('open',()=>{
    console.log("connected");


    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on('change',(change)=>{
        console.log("change occured",change);

        if(change.operationType==='insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted',{
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received,
            }
            );
        }else{
            console.log("error triggering pusher")
        }



    });

});

//???

// api routes
app.get('/', (req,res)=> res.status(200).send("hello world"))

app.get("/messages/sync", (req,res)=>{
    Messages.find((err,data)=>{
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(201).send(data);
        }
    });
});

app.post("/messages/new",(req,res)=>{
    const dbMessage = req.body;

    Messages.create(dbMessage, (err,data)=>{
        if(err){
            res.status(500).send(err)
        } else{
            res.status(201).send(data)
        }
    });
});
// listener 
app.listen(port,()=>console.log(`Listening on ${port}`))