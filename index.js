const express=require("express");
const body_parser=require("body-parser");

const app= express().use(body_parser.json());
require('dotenv').config();

const mytoken=process.env.TOKEN;

app.listen(process.env.PORT,()=>{
    console.log("web hook is responding");
});

app.get("/webhook", (req,res)=>{
    let mode=req.query["hub.mode"];
    let challange=req.query["hub.challenge"];
    let token=req.query["hub.verify_token"];

    

     if(mode && token){
        if(mode==="subcribe"  && token===mytoken){
            res.status(200).send(challange);
        }else{
            res.status(403);
        }
     }
});


app.get("/", (req,res)=>{
    res.status(200).send("webhook set up DONE");
});