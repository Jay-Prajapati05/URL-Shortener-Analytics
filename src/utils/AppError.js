// src/utils/AppError.js
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // "expected" error hai, crash nahi hai
    Error.captureStackTrace(this, this.constructor);
  }
}