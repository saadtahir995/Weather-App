import express from 'express';
import config from '../config/config.js';
import fetch from 'node-fetch'
const app = express();
app.use(config);
app.post('/time', async(req, res) => {
    try{
    const{lat,lon}=req.body.coord;
    const response=await fetch(`https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`);
    const time=await response.json();
    res.status(200).json(time);
    }
    catch(error)
    {
      return res.status(404).json({message:"Data not found"});
    }
});
export default app;