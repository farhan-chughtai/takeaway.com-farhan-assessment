import { MoveDto } from "../dtos/MoveDto";
import { Player } from "../entities/Player";
import { NotFoundError } from "./errors/NotFoundError";

export class Game {
  private player1: Player;
  private player2: Player;
  private curentPlayer: Player;

  constructor(player1: Player, player2: Player) {
    this.player1 = player1;
    this.player2 = player2;
    this.curentPlayer = this.player1;
  }

  public getCurrentPlayer(): Player {
    return this.curentPlayer;
  }

  public getOtherPlayer(): Player {
    return this.curentPlayer === this.player1 ? this.player2 : this.player1;
  }

  public getPlayerBySocketId(socketId: string): Player | null {
    return this.player1.getSocketId() === socketId
      ? this.player1
      : this.player2.getSocketId() === socketId
      ? this.player2
      : null;
  }
  public firstMove(): number {
    const result = this.curentPlayer.firstMove();

    this.curentPlayer =
      this.curentPlayer === this.player1 ? this.player2 : this.player1;
    return result;
  }

  public playMove(resultingNumber: number): MoveDto {
    const result = this.curentPlayer.makeMove(resultingNumber);

    this.curentPlayer = this.setNextTurn();

    return result;
  }

  public playManualMove(resultingNumber: number, manualMove: number): any {
    const result = this.curentPlayer.makeManualMove(
      resultingNumber,
      manualMove
    );

    this.curentPlayer = this.setNextTurn();
    return result;
  }

  public isGameOver(): boolean {
    return this.player1.getNumber() === 1 || this.player2.getNumber() === 1;
  }

  public gameWinner(): string | null {
    return this.player1.getNumber() === 1
      ? this.player1.getSocketId()
      : this.player2.getNumber() === 1
      ? this.player2.getSocketId()
      : null;
  }

  public updatePlayerGameMode(mode: string, socketId: string): void {
    const player = this.getPlayerBySocketId(socketId);
    if (!player) {
      throw new NotFoundError("Player not found!");
    }
    player.updateGameMode(mode);
  }

  private setNextTurn() {
    return this.curentPlayer === this.player1 ? this.player2 : this.player1;
  }
}
