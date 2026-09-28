// src/schemas/url.schema.js
import { z } from 'zod';

export const shortenUrlSchema = z.object({
  longUrl: z.string().url({ message: 'Please provide a valid URL' }),
  expiresIn: z.number().positive().optional(), // in seconds
});