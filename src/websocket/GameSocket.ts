import { Server, Socket } from "socket.io";
import { GameService } from "../domain/services/GameService";
import { Player } from "../repositories/Player";
import { Player as PlayerObj } from "../domain/valueObjects/Player";
import { SocketEvent } from "../Enums/SocketEventEnums";
import { ManualMoveDto } from "../domain/dtos/ManualMoveDto";

class GameSocket {
  private io: Server;
  private playerRepo: Player;
  private gameService: GameService | undefined;

  constructor(io: Server, playerRepo: Player) {
    this.io = io;
    this.playerRepo = playerRepo;
    this.initializeSocket();
  }

  private initializeSocket() {
    this.io.on(SocketEvent.CONNECTION, (socket: Socket) => {
      try {
        console.log("User connected:", socket.id);

        this.handlePlayerLogic(socket);
        this.handleGameServiceLogic(socket);
        this.handlePlayManualLogic(socket);
        this.handleDisconnectLogic(socket);
      } catch (error) {
        socket.emit(SocketEvent.ERROR, error);
      }
    });
  }

  private handlePlayerLogic(socket: Socket) {
    if (this.playerRepo.getPlayersCount() > 1) {
      socket.emit(
        SocketEvent.GAME_BUSY,
        "The game is busy with two players. Please try again later"
      );
    } else {
      const p = new PlayerObj(socket.id, socket.handshake.query.mode as string);
      this.playerRepo.add(p);
    }
    if (this.playerRepo.getPlayersCount() === 1) {
      socket.emit(
        SocketEvent.WAIT_FOR_OTHER_USER_JOIN,
        "Please wait for another user to join the game."
      );
    }
  }

  private handleGameServiceLogic(socket: Socket) {
    if (this.playerRepo.getPlayersCount() === 2) {
      const players = this.playerRepo.getAllPlayers();

      this.gameService = new GameService(players[0], players[1]);
      const firstMove = this.gameService.playFirstMove(this.io);
      const winner = this.gameService.playGame(this.io, firstMove);

      if (winner) {
        this.io.emit(SocketEvent.RESULT, winner);
      }
    }
  }

  private handlePlayManualLogic(socket: Socket) {
    socket.on(SocketEvent.MANUAL_MOVE, (manualMove) => {
      try {
        this.gameService &&
          this.gameService.playManualMove(
            this.io,
            manualMove.givenNumber,
            manualMove.move
          );
      } catch (error: any) {
        socket.emit(SocketEvent.ERROR, error.name);
      }
    });
  }

  private handleDisconnectLogic(socket: Socket) {
    socket.on(SocketEvent.DISCONNECT, () => {
      this.playerRepo.removePlayerBySocketId(socket.id);
    });
  }
}

export default GameSocket;
