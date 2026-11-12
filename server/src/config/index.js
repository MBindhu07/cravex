import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  jwtSecret: process.env.JWT_SECRET || 'cravex_super_secret_jwt_key_2026_production',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  mongoUri: process.env.MONGODB_URI || '',
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_cravex_demo',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'cravex_demo_secret',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

export default config;
