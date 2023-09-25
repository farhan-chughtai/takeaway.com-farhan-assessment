import { Server } from "socket.io";
import { GameService } from "../../../domain/services/GameService";
import { Player } from "../../../domain/valueObjects/Player";
import { Game } from "../../../domain/aggregates/Game";
import { MoveDto } from "../../../domain/dtos/MoveDto";

describe("GameService", () => {
  let player1: Player;
  let player2: Player;
  let gameService: GameService;
  let io: Server;

  beforeEach(() => {
    player1 = new Player("player1", "automatic");
    player2 = new Player("player2", "automatic");
    gameService = new GameService(player1, player2);

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
});
