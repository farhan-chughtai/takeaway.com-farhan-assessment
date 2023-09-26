import { Player as PlayerObj } from "../domain/entities/Player";

export interface Player {
  add(player: PlayerObj): void;
  getAllPlayers(): PlayerObj[];
  getPlayersCount(): number;
  getPlayerBySocketId(socketId: string): PlayerObj | undefined;
  removePlayerBySocketId(socketId: string): boolean;
}
