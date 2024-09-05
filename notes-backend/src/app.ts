import express, { Application } from 'express';
import dotenv from 'dotenv';
import { notesRoutes } from './routes/notes.js'
import cors from 'cors';
//For env File 
dotenv.config();

let app: Application = express();
let port = process.env.PORT || 5000;
let corsoptions = {
    exposedHeaders: ['authorization'],
    credentials: true,
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173']
}
app.use(cors(corsoptions));
app.use(express.json())
app.use('/api', notesRoutes)

app.listen(port, () => console.log(`server started at port  ${port}`))