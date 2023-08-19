import express from 'express';
import config from '../config/config.js';
import fetch from 'node-fetch'
const app=express();
app.use(config);


app.post('/getlocation', async(req, res) => {
    const{ip}=req.body;
    const GEO_LOCATION_API=`https://api.ip2location.io/?key=556F8C380D55A314C8EB6D3FCE84213F&ip=${ip}&package=WS1`;
    try{
    const response = await fetch(GEO_LOCATION_API);
    const data = await response.json();
    res.json({data:data});
    }catch(error){
    console.log(error);
    }
});
export default app;
    

