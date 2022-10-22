const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");

const app= express().use(body_parser.json());
require('dotenv').config();

const mytoken=process.env.MYTOKEN;
const token=process.env.TOKEN;

app.listen(process.env.PORT,()=>{
    console.log(
        "-------------- Web hook is responding -------------"
        );
});

// this is base url for web hook
app.get("/", (req,res)=>{
    res.status(200).send("webhook set up DONE");
});


// get request for web hook
app.get("/facebook", (req,res)=>{
    let mode=req.query["hub.mode"];
    let challange=req.query["hub.challenge"];
    let token=req.query["hub.verify_token"];

    

     if(mode && token){
        if(mode==="subscribr"  && token===mytoken){
            res.status(200).send(challange);
        }else{
            res.status(403);
        }
     }
});


// post request for web hook
app.post("/facebook", (req, res)=>{
    let body_param=req.body;
    console.log(JSON.stringify(body_param, null, 2));

    if(body_param.object){
        if(body_param.entry && 
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.message &&
            body_param.entry[0].changes[0].value.message[0]
            ){
                let phone_number_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
                let from=body_param.entry[0].changes[0].value.messages[0].from;
                let msg_body=body_param.entry[0].changes[0].value.messages[0].text.body;
                axios({
                    method:"POST",
                    url: "https://graph.facebook.com/v15.0/"+phone_number_id+"/messages?access_token="+token,
                    data:{
                        messaging_product:"whatsapp",
                        to:from,
                        text:{
                            body: "Hi AJ"
                        }
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }
    }
})