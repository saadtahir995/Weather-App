import express from 'express';
import bodyParser from 'body-parser';
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
export default app;