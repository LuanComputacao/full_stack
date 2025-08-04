import express from 'express';
import morgan from 'morgan';
import logger from '../config/logger';

// Custom morgan format with emojis
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

export const requestLogger = morgan(morganFormat, {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
    },
  },
});

export const customRequestLogger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const start = Date.now();

  // Log the request
  console.log(`📥 ${req.method} ${req.url} - ${new Date().toISOString()}`);

  // Log response when it finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusEmoji = res.statusCode >= 400 ? '❌' : '✅';
    console.log(`${statusEmoji} ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};
