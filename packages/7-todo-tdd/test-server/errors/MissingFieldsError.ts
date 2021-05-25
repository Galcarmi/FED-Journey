import { ServerError } from './ServerError';
import { HTTPStatuses } from '../constants/HTTPStatus';

export class MissingFieldsError extends ServerError {
  constructor(missingFields: string) {
    super(HTTPStatuses.BAD_REQUEST, `missing fields: ${missingFields}`);
  }
}
