import Url from "../models/url.js";
import { generateShortCode } from "../utils/generateShortCode.js";
import { AppError } from "../utils/AppError.js";

const MAX_RETRIES = 5;

export const createShortUrl = async (longUrl, expiresIn) => {
  let shortCode;
  let attempts = 0;

  // collision check: bahut kam chance hai, lekin scale pe possible hai
  while (attempts < MAX_RETRIES) {
    shortCode = generateShortCode();
    const existing = await Url.findOne({ shortCode });
    if (!existing) break;
    attempts++;
  }

  if (attempts === MAX_RETRIES) {
    throw new AppError(
      "Unique short code nahi bana paye, dobara try karo",
      500,
    );
  }

  const expiresAt = expiresIn
    ? new Date(Date.now() + expiresIn * 1000) // expiresIn seconds mein aayega
    : null;

  const url = await Url.create({ longUrl, shortCode, expiresAt });
  return url;
};

export const getOriginalUrl = async (shortCode) => {
  const url = await Url.findOne({ shortCode });

  if (!url) {
    throw new AppError("Short URL nahi mila", 404);
  }

  if (url.expiresAt && url.expiresAt < new Date()) {
    throw new AppError("Ye link expire ho chuka hai", 410);
  }

  // atomic increment — alag se, taaki concurrent clicks mein count lose na ho
  await Url.updateOne({ _id: url._id }, { $inc: { clicks: 1 } });

  return url.longUrl;
};
