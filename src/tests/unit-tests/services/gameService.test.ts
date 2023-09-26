import { Server } from "socket.io";
import { GameService } from "../../../domain/services/GameService";
import { Player } from "../../../domain/entities/Player";
import { Game } from "../../../domain/aggregates/Game";
import { SocketEvent } from "../../../Enums/SocketEventEnums";

describe("GameService", () => {
  let player1: Player;
  let player2: Player;
  let gameService: GameService;
  let io: Server;
  let mockGame: Game;

  beforeEach(() => {
    player1 = new Player("player1", "automatic");
    player2 = new Player("player2", "automatic");
    gameService = new GameService(player1, player2);
    mockGame = new Game(player1, player2);

    io = {
      on: jest.fn(),
      emit: jest.fn(),
    } as unknown as Server;
  });

  it("should play game and emit winner", () => {
    const result = gameService.playFirstMove(io);
    const winner = gameService.playGame(io, result);

    expect(["player1", "player2"]).toContain(winner);
  });

  it("should play first move and emit FIRST_MOVE event", () => {
    const result = gameService.playFirstMove(io);

    expect(result).toBeGreaterThan(1);
    expect(result).toBeLessThan(1000);
    expect(io.emit).toHaveBeenCalledWith(SocketEvent.FIRST_MOVE, result);
  });

  it("should play manual move with valid move and emit MOVE event", () => {
    const mockResultingNumber = 10;
    const mockManualMove = -1;
    gameService.playGame = jest.fn();

    gameService.playManualMove(io, mockResultingNumber, mockManualMove);

    expect(gameService.playGame).toBeCalled();

    expect(io.emit).toBeCalled();
  });

  it("should not play manual move with invalid move and throw an error", () => {
    const mockResultingNumber = 10;
    const mockManualMove = 2;
    gameService.playGame = jest.fn();
    expect(() => {
      gameService.playManualMove(io, mockResultingNumber, mockManualMove);
    }).toThrowError();
  });
});
