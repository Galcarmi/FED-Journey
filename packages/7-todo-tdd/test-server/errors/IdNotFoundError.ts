import { ServerError } from './ServerError';
import { HTTPStatuses } from '../constants/HTTPStatus';

export class IdNotFoundError extends ServerError {
  constructor(id: string) {
    super(HTTPStatuses.BAD_REQUEST, `id not found: ${id}`);
  }
}
