import express from 'express';
import { signIn } from '../Controllers/Auth/SignUp.js';

const router = express.Router();

router.post('/signIn', signIn);

export default router;