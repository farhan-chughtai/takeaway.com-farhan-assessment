import { Player } from "../../../domain/valueObjects/Player";
import { Game } from "../../../domain/aggregates/Game";
import { MoveDto } from "../../../domain/dtos/MoveDto";

describe("Game", () => {
  let player1: Player;
  let player2: Player;
  let game: Game;

  beforeEach(() => {
    // Create mock player instances if needed
    player1 = new Player("1", "automatic");
    player2 = new Player("2", "automatic");
    game = new Game(player1, player2);
  });

  it("should switch players on first move", () => {
    // Mock the firstMove method of player1 to return a number
    player1.firstMove = jest.fn(() => 45);

    const currentPlayerBeforeFirstMove = game.getCurrentPlayer();
    const firstMoveResult = game.firstMove();
    const currentPlayerAfterFirstMove = game.getCurrentPlayer();

    expect(firstMoveResult).toBe(45);
    expect(currentPlayerBeforeFirstMove).toBe(player1);
    expect(currentPlayerAfterFirstMove).toBe(player2);
  });

  it("should play a move and switch players", () => {
    // Mock the makeMove method of the current player
    player1.makeMove = jest.fn(() => ({
      givenNumber: 5,
      added: 1,
      resultingNumber: 3,
      mode: "automatic",
    }));

    const currentPlayerBeforeMove = game.getCurrentPlayer();
    const moveResult = game.playMove(5);
    const currentPlayerAfterMove = game.getCurrentPlayer();

    expect(moveResult).toEqual({
      givenNumber: 5,
      added: 1,
      resultingNumber: 3,
      mode: "automatic",
    });
    expect(currentPlayerBeforeMove).toBe(player1);
    expect(currentPlayerAfterMove).toBe(player2);
  });

  it("should play a manual move and switch players", () => {
    // Mock the makeManualMove method of the current player
    player1.makeManualMove = jest.fn(() => ({
      givenNumber: 5,
      added: 1,
      resultingNumber: 3,
      mode: "automatic",
    }));

    const currentPlayerBeforeManualMove = game.getCurrentPlayer();
    const manualMoveResult = game.playManualMove(5, 1);
    const currentPlayerAfterManualMove = game.getCurrentPlayer();

    expect(manualMoveResult).toEqual({
      givenNumber: 5,
      added: 1,
      resultingNumber: 3,
      mode: "automatic",
    });
    expect(currentPlayerBeforeManualMove).toBe(player1);
    expect(currentPlayerAfterManualMove).toBe(player2);
  });

  it("should detect game over", () => {
    // Mock the getNumber method of both players
    player1.getNumber = jest.fn(() => 1);
    player2.getNumber = jest.fn(() => 2);

    const isGameOver = game.isGameOver();
    expect(isGameOver).toBe(true);
  });

  it("should determine the game winner", () => {
    // Mock the getNumber and getSocketId methods of players
    player1.getNumber = jest.fn(() => 1);
    player2.getNumber = jest.fn(() => 2);
    player1.getSocketId = jest.fn(() => "player1SocketId");
    player2.getSocketId = jest.fn(() => "player2SocketId");

    const winner = game.gameWinner();
    expect(winner).toBe("player1SocketId");
  });
});
