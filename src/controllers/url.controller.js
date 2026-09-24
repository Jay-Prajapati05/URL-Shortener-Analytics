import { createShortUrl, getOriginalUrl } from "../services/urlService.js";

export const shortenUrl = async (req, res, next) => {
  try {
    const { longUrl, expiresIn } = req.body;

    if (!longUrl) {
      return res.status(400).json({ message: "longUrl zaroori hai" });
    }

    const url = await createShortUrl(longUrl, expiresIn);

    res.status(201).json({
      shortCode: url.shortCode,
      shortUrl: `${req.protocol}://${req.get("host")}/${url.shortCode}`,
    });
  } catch (err) {
    next(err); // error handler ko de do, khud handle mat karo
  }
};

export const redirectToUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const longUrl = await getOriginalUrl(shortCode);
    res.redirect(longUrl);
  } catch (err) {
    next(err);
  }
};
