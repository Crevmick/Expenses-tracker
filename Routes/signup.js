import express from 'express';
import { signUp } from '../Controllers/Auth/SignUp.js';

const router = express.Router();

router.post('/signUp', signUp);

export default router;