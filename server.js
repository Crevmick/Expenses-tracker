//importing dependencies 
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';


//importing environment variables
dotenv.config();

//setting up __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);                 


//importing routes



//initializing express app
const app = express();


//middleware
app.use(cors());
app.use(helmet());
app.use(express.json());    
app.use(morgan('dev'));

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/api', apiRoutes); // Uncomment and replace with your actual routes  



//error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});



//example route
app.get('/', (req, res) => {
  res.send('Welcome to the Express.js server!');
});

//listen to our server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});