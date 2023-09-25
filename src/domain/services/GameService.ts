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
      const winner = this.game.gameWinner();
      if (winner) {
        io.emit(SocketEvent.RESULT, winner);
      }
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
    this.playGame(io, moveResult.resultingNumber);
  }

  public changePlayerGameMode(
    updateMode: string,
    socketId: string,
    io: Server
  ): void {
    const player = this.game.getPlayerBySocketId(socketId);
    if (player) {
      player.updateGameMode(updateMode);

      // Mode is changing from manual to automatic
      if (updateMode === "automatic") {
        const currentPlayer = this.game.getCurrentPlayer();
        const move = this.game.getOtherPlayer().getNumber();
        // This checks if it's your turn then run the move in automatic mode
        if (currentPlayer.getSocketId() === socketId && move) {
          this.playGame(io, move);
        }
      }
    }
  }

  private isManualMove(currentPlayer: Player): boolean {
    return currentPlayer.getMode() === "manual" ? true : false;
  }
}
