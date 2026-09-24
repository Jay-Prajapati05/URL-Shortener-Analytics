// src/schemas/url.schema.js
import { z } from 'zod';

export const shortenUrlSchema = z.object({
  longUrl: z.string().url({ message: 'Valid URL do' }),
  expiresIn: z.number().positive().optional(), // seconds mein
});