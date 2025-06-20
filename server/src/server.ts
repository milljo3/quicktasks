import express = require('express');
import {Request, Response} from "express";
import dotenv = require('dotenv');
import cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));