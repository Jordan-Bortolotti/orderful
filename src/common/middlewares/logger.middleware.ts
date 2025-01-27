import { Request, Response, NextFunction } from 'express';
const logger = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    const currentTimeUTC = new Date().toISOString();
    console.info(
      `${currentTimeUTC} [${req.method}] ${req.path} - ${res.statusCode}`,
    );
  });
  next();
};

export default logger;
