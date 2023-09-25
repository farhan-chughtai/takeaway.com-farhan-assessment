import { Server, Socket } from "socket.io";
import GameSocket from "../../../websocket/GameSocket";
import { Player } from "../../../repositories/Player";
import { PlayerRepo } from "../../../repositories/PlayerRepo";

describe("GameSocket", () => {
  let io: Server;
  let playerRepo: Player;
  let gameSocket: GameSocket;
  let socket: jest.Mocked<Socket>;

  beforeEach(() => {
    // Create mock instances
    io = {
      on: jest.fn(),
      emit: jest.fn(),
    } as unknown as Server;
    playerRepo = new PlayerRepo();
    gameSocket = new GameSocket(io, playerRepo);

    socket = {
      id: "mocked-socket-id",
      handshake: {
        query: {
          mode: "automatic",
        },
      },
      on: jest.fn(),
      emit: jest.fn(),
    } as unknown as jest.Mocked<Socket>;
  });

  it("should handle player logic", () => {
    // Call the private method to handle player logic
    gameSocket["handlePlayerLogic"](socket);

    // After handling player logic, there should be one more player in the repository
    expect(playerRepo.getPlayersCount()).toBe(1);
    expect(socket.emit).toHaveBeenCalledWith(
      "wait_for_other_user_join",
      "Please wait for another user to join the game."
    );
    // Simulate another player joining
    gameSocket["handlePlayerLogic"](socket);
    expect(playerRepo.getPlayersCount()).toBe(2);
    // it will not allow to play when 2 players are playing
    gameSocket["handlePlayerLogic"](socket);
    expect(playerRepo.getPlayersCount()).toBe(2);
    expect(socket.emit).toHaveBeenCalledWith(
      "game_busy",
      "The game is busy with two players. Please try again later"
    );
  });
});
