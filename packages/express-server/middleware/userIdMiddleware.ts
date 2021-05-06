import express from 'express';
import { v4 } from 'uuid';
import { IDigestedRequest } from '../types/IDigestedRequest';
import jwt, { Secret } from 'jsonwebtoken';
import { UnAuthenticatedError } from '../errors/UnAuthenticatedError';
import { IUserId } from '../types/IUserId';

const encrypt = (userIdWrapper: IUserId): string => {
  return jwt.sign(userIdWrapper, <Secret>process.env.JWTKey);
};

const decrypt = (JWTToken: string): IUserId => {
  return <IUserId>jwt.verify(JWTToken, <Secret>process.env.JWTKey);
};

export const userIdMiddleware = (
  req: express.Request,
  res: express.Response,
  next: Function
): void => {
  try {
    let userIdJWT: string | undefined = req.cookies.userId;
    if (!userIdJWT) {
      userIdJWT = encrypt({ userId: v4() });
      res.cookie('userId', userIdJWT);
    }

    (<IDigestedRequest>req).userId = decrypt(userIdJWT).userId;
    next();
  } catch (err) {
    next(new UnAuthenticatedError());
  }
};
