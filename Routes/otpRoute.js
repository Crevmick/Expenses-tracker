import express from 'express';
import { verifyOTP, resendOTPVerificationCode } from '..';

const router = express.Router();

router.post('/verifyOTP', verifyOTP);
router.post('/resendOTPVerificationCode', resendOTPVerificationCode);

export default router;