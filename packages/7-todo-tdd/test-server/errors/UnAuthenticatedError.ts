import { ServerError } from './ServerError';
import { HTTPStatuses } from '../constants/HTTPStatus';

export class UnAuthenticatedError extends ServerError {
  constructor() {
    super(HTTPStatuses.UNAUTHENTICATED, `unauthenticated user!`);
  }
}
