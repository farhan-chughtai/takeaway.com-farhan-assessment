import { generateRandomNumber } from "../../lib/common";
import { InvalidMoveError } from "../aggregates/errors/InvalidMoveError";
import { MoveDto } from "../dtos/MoveDto";

const MOVES = [-1, 0, 1];

export class Player {
  private socketId: string;
  private number: number | null;
  private mode: string;

  constructor(socketId: string, mode: string, number: number | null = null) {
    this.socketId = socketId;
    this.mode = mode;
    this.number = number;
  }

  getNumber(): number | null {
    return this.number;
  }

  getSocketId(): string {
    return this.socketId;
  }

  getMode(): string {
    return this.mode;
  }

  public firstMove(): number {
    const max = 1000;
    const min = 1;

    this.number = generateRandomNumber(min, max);
    return this.number;
  }

  public makeMove(resultingNumber: number): MoveDto {
    let selectedMove = 0;

    for (let i = 0; i < MOVES.length; i++) {
      if ((resultingNumber + MOVES[i]) % 3 === 0) {
        selectedMove = MOVES[i];
        break;
      }
    }
    this.number = (resultingNumber + selectedMove) / 3;

    return {
      givenNumber: resultingNumber,
      added: selectedMove,
      resultingNumber: this.number,
      mode: this.mode,
    };
  }

  public makeManualMove(givenNumber: number, selectedMove: number): MoveDto {
    const isValidMove = this.isValidManualMove(givenNumber, selectedMove);
    if (!isValidMove) {
      throw new InvalidMoveError();
    }
    this.number = (givenNumber + selectedMove) / 3;

    return {
      givenNumber: givenNumber,
      added: selectedMove,
      resultingNumber: this.number,
      mode: this.mode,
    };
  }

  public updateGameMode(mode: string) {
    if (mode != "automatic" && mode != "manual") {
      throw new Error();
    }
    this.mode = mode;
  }

  private isValidManualMove(givenNumber: number, moveValue: number) {
    return MOVES.includes(moveValue) && (givenNumber + moveValue) % 3 === 0;
  }
}
