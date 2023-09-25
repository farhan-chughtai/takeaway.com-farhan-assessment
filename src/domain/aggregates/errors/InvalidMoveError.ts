export class InvalidMoveError extends Error {
  constructor() {
    super(
      `Legal values are: 1, 0, -1 and resulting number should be divisible by 3`
    );
    Object.setPrototypeOf(this, InvalidMoveError.prototype);
  }
}
