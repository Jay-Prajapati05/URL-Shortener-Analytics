// src/routes/url.routes.js
import { Router } from 'express';
import { shortenUrl, redirectToUrl } from '../controllers/url.controller.js';
import { validate } from '../middlewares/validate.js';
import { shortenUrlSchema } from '../schemas/url.schema.js';

const router = Router();

router.post('/shorten', validate(shortenUrlSchema), shortenUrl);
router.get('/:shortCode', redirectToUrl);

export default router;