export class ServerError extends Error {
  HTTPStatus: number;
  constructor(HTTPStatus: number, clientErrorMessage: string) {
    super(
      `server error ${HTTPStatus}: ${clientErrorMessage || 'internal error'}`
    );
    this.HTTPStatus = HTTPStatus;
  }
}
