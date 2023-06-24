const express = require('express');
const app = express();

app.get('/',(req,res)=>{
    res.send('Hello world1')
})

app.get('/short',(req,res)=>{
    res.send('Hello from short')
})

app.listen(process.env.PUBLIC_PORT|| 10000,()=>{
    console.log('Server started')
})