import express from 'express';
import { ServerError } from '../errors/ServerError';
import { HTTPStatuses } from '../constants/HTTPStatus';

export const wrapError = (fn: Function) => async (
  req: express.Request,
  res: express.Response,
  next: Function
): Promise<void> => {
  try {
    await fn(req, res, next);
  } catch (err) {
    next(err);
  }
};

export const errorMiddleware = (
  err: Error | ServerError,
  req: express.Request,
  res: express.Response,
  next: Function
): void => {
  console.log(err)
  if ((<ServerError>err).HTTPStatus) {
    res.status((<ServerError>err).HTTPStatus).send(err.message);
  } else {
    res.status(HTTPStatuses.INTERNAL_SERVER_ERROR).send(err);
  }
};
