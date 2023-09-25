import { Game } from "../aggregates/Game";
import { MoveDto } from "../dtos/MoveDto";
import { Player } from "../valueObjects/Player";
import { Server, Socket } from "socket.io";
import { SocketEvent } from "../../Enums/SocketEventEnums";
export class GameService {
  private game: Game;

  constructor(player1: Player, player2: Player) {
    this.game = new Game(player1, player2);
  }

  public playFirstMove(io: Server): number {
    const result = this.game.firstMove();
    io.emit(SocketEvent.FIRST_MOVE, result);
    return result;
  }

  public playGame(io: Server, move: number): string | null {
    let result: MoveDto;
    let playerMove = move;

    while (
      !this.game.isGameOver() &&
      !this.isManualMove(this.game.getCurrentPlayer())
    ) {
      result = this.game.playMove(playerMove);

      io.emit(SocketEvent.MOVE, result);

      playerMove = result.resultingNumber;
    }

    if (this.game.isGameOver()) {
      return this.game.gameWinner();
    } else if (this.isManualMove(this.game.getCurrentPlayer())) {
      io.emit(
        SocketEvent.RUN_MANUAL_MOVE,
        this.game.getCurrentPlayer().getSocketId()
      );
    }
    return null;
  }

  public playManualMove(
    io: Server,
    resultingNumber: number,
    manualMove: number
  ): void {
    const moveResult = this.game.playManualMove(resultingNumber, manualMove);
    io.emit(SocketEvent.MOVE, moveResult);
    const winner = this.playGame(io, moveResult.resultingNumber);
    if (winner) {
      io.emit(SocketEvent.RESULT, winner);
    }
  }

  private isManualMove(currentPlayer: Player): boolean {
    return currentPlayer.getMode() === "manual" ? true : false;
  }
}
