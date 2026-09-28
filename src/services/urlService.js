import Url from "../models/url.js";
import { generateShortCode } from "../utils/generateShortCode.js";
import { AppError } from "../utils/AppError.js";
import { getCache, setCache } from './cacheService.js';

const MAX_RETRIES = 5;

export const createShortUrl = async (longUrl, expiresIn) => {
  let shortCode;
  let attempts = 0;

  // collision check: very unlikely, but possible at scale
  while (attempts < MAX_RETRIES) {
    shortCode = generateShortCode();
    const existing = await Url.findOne({ shortCode });
    if (!existing) break;
    attempts++;
  }

  if (attempts === MAX_RETRIES) {
    throw new AppError(
      "Could not generate a unique short code, please try again",
      500,
    );
  }

  const expiresAt = expiresIn
    ? new Date(Date.now() + expiresIn * 1000) // expiresIn is in seconds
    : null;

  const url = await Url.create({ longUrl, shortCode, expiresAt });
  return url;
};

export const getOriginalUrl = async (shortCode) => {
   const cacheKey = `shortCode:${shortCode}`;
  const cached = await getCache(cacheKey);

  if (cached) {
    const data = JSON.parse(cached);
    console.log('CACHE HIT:', shortCode);

    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      throw new AppError('This link has expired', 410);
    }

    //  update click count in the background so the redirect doesn't wait on the DB write
    Url.updateOne({ shortCode }, { $inc: { clicks: 1 } }).catch((err) =>
      console.error('Click update failed:', err)
    );

    return data.longUrl;
  }
  
  
  
  const url = await Url.findOne({ shortCode });

  if (!url) {
    throw new AppError("Short URL not found", 404);
  }

  if (url.expiresAt && url.expiresAt < new Date()) {
    throw new AppError("This link has expired", 410);
  }
  
   await setCache(cacheKey, JSON.stringify({ longUrl: url.longUrl, expiresAt: url.expiresAt }));
  // atomic increment, done separately so concurrent clicks don't lose counts
  await Url.updateOne({ _id: url._id }, { $inc: { clicks: 1 } });
  console.log('CACHE MISS (fetch from DB, then populate the cache):', shortCode);
  return url.longUrl;
};


