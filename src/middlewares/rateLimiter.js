import rateLimit from 'express-rate-limit';

export const shortenRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // per IP, per minute
  message: { success: false, message: 'Bahut zyada requests, thoda ruk ke try karo' },
  standardHeaders: true,
  legacyHeaders: false,
});