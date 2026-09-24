import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import urlRoutes from './routes/url.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public")) //use for store files in server
app.use(cookieParser())
 

//url projects

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/', urlRoutes); // shorten + redirect dono yahin se

app.use(errorHandler); // hamesha SABSE LAST


export {app}