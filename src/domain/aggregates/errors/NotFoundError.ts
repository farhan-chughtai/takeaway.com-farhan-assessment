export class NotFoundError extends Error {
  constructor(public message: string, public meta?: Record<string, any>) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
