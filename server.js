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
import signinRoute from './Routes/signin.js';
import signupRoute from './Routes/signup.js';
import categoryRoute from './Routes/CategotyRoute.js';
import expensesRoute from './Routes/ExpensesRoute.js';
import otpRoute from './Routes/otpRoute.js';
import forgetPasswordRoute from './Routes/forgetPasswordRoute.js';


//initializing express app
const app = express();


//middleware
app.use(cors());
app.use(helmet());
app.use(express.json());    
app.use(morgan('dev'));

//serving static files
app.use(express.static(path.join(__dirname, 'public')));


// API routes
app.use('/api/auth', signinRoute);
app.use('/api/auth', signupRoute);
app.use('/api/otp', otpRoute);
app.use('/api/password', forgetPasswordRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/expenses', expensesRoute);



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