// src/middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // isOperational = humne khud ye error socha aur bheja (404, 410, etc.)
  // agar false hai, matlab ye ek unexpected bug hai — raw message client ko mat bhejo
  const message = err.isOperational
    ? err.message
    : "Kuch galat ho gaya, server error";

  if (process.env.NODE_ENV !== "production") {
    console.error(err); // dev mein full error dikhna chahiye debug ke liye
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
