import { Player as PlayerObj } from "../domain/valueObjects/Player";
import { Player } from "./Player";

export class PlayerRepo implements Player {
  private players: PlayerObj[] = [];

  public add(player: PlayerObj) {
    this.players.push(player);
  }

  public getAllPlayers(): PlayerObj[] {
    return this.players;
  }

  public getPlayersCount(): number {
    return this.players.length;
  }

  public getPlayerBySocketId(socketId: string): PlayerObj | undefined {
    return this.players.find((player) => player.getSocketId() === socketId);
  }

  public removePlayerBySocketId(socketId: string): boolean {
    const indexToRemove = this.players.findIndex(
      (player) => player.getSocketId() === socketId
    );

    if (indexToRemove !== -1) {
      this.players.splice(indexToRemove, 1);
      return true;
    }
    return false;
  }
}
