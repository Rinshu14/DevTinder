//console.log("starting app");

const express=require("express");
const app=express();


app.use((req,res)=>{
    res.send()
    
})
app.listen(3000,()=>{
    console.log("server started");
});

app.get("/",(req,res)=>{
    res.send("hello world");
})