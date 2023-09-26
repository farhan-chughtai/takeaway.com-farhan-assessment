import { Player as PlayerObj } from "../../../domain/entities/Player";
import { Player } from "../../../repositories/Player";
import { PlayerRepo } from "../../../repositories/PlayerRepo";

describe("PlayerRepo", () => {
  let playerRepo: Player;

  beforeEach(() => {
    playerRepo = new PlayerRepo();
  });

  it("should add a player", () => {
    const player: PlayerObj = new PlayerObj("socket-1", "automatic");
    playerRepo.add(player);
    expect(playerRepo.getAllPlayers()).toContain(player);
    expect(playerRepo.getPlayersCount()).toBe(1);
  });

  it("should get all players", () => {
    const player1: PlayerObj = new PlayerObj("socket-1", "automatic");
    const player2: PlayerObj = new PlayerObj("socket-2", "manual");
    playerRepo.add(player1);
    playerRepo.add(player2);
    const players = playerRepo.getAllPlayers();
    expect(players).toContain(player1);
    expect(players).toContain(player2);
  });

  it("should get players count", () => {
    expect(playerRepo.getPlayersCount()).toBe(0);
    playerRepo.add(new PlayerObj("socket-1", "automatic"));
    expect(playerRepo.getPlayersCount()).toBe(1);
  });

  it("should get player by socketId", () => {
    const player: PlayerObj = new PlayerObj("socket-1", "automatic");
    playerRepo.add(player);
    const foundPlayer = playerRepo.getPlayerBySocketId("socket-1");
    expect(foundPlayer).toBe(player);
  });

  it("should remove a player by socketId", () => {
    const player: PlayerObj = new PlayerObj("socket-1", "automatic");
    playerRepo.add(player);
    const removed = playerRepo.removePlayerBySocketId("socket-1");
    expect(removed).toBe(true);
    expect(playerRepo.getAllPlayers()).not.toContain(player);
    expect(playerRepo.getPlayersCount()).toBe(0);
  });

  it("should return false when removing a non-existent player", () => {
    const removed = playerRepo.removePlayerBySocketId("non-existent-socket");
    expect(removed).toBe(false);
  });
});
