import express from 'express';
import config from './config/config.js';
import getLocation from './API/getlocation.js'
import getTime from './API/gettime.js'
import cors from 'cors'
const app = express();
app.use(cors({
    origin: 'https://weather-app-eight-zeta-22.vercel.app/',
    methods: ['GET', 'POST'],
    credentials: true,
     optionsSuccessStatus:200 // To allow cookies, authorization headers, etc. (important for 'include')
  }));
app.use(config);
app.use('/api',getLocation);
 app.use('/api/gettime',getTime);
app.listen(9000, () => {
    console.log('Server started!');
    }
);