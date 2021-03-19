import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configs/baseConfig';
import User from '../models/User';

/**
 * Sign token
 * @param user the user
 */
export const signToken = (user: User): string => {
  //Delete password property
  delete user.password;

  return jwt.sign({ data: user }, JWT_SECRET, {
    expiresIn: 9999999,
  });
};

/**
 *
 * @param req
 * @param res
 * @param next
 */
export const isCorrectToken = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const token = req.headers.authorization;
  if (token) {
    const onlyToken = token.slice(7, token.length);
    try {
      req.user = await jwt.verify(onlyToken, JWT_SECRET);
      next();
      return;
    } catch (err) {
      if (err) return res.status(401).send({ msg: 'Invalid Token' });
    }
  } else return res.status(401).send({ msg: 'Token is not supplied' });
};
