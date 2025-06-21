import express = require('express');
import {Request, Response} from "express";
import dotenv = require('dotenv');
import cors = require('cors');
import authRoutes from "./routes/authRoutes";
import boardsRoutes from "./routes/boardsRoutes";
import listsRoutes from "./routes/listsRoutes";
import tasksRoutes from "./routes/tasksRoutes";

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

app.use('/api/auth', authRoutes);
app.use('/api/boards', boardsRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/tasks', tasksRoutes);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));