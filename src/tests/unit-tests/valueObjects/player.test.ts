import { Player } from "../../../domain/valueObjects/Player";
import { MoveDto } from "../../../domain/dtos/MoveDto";

describe("Player", () => {
  let player: Player;

  beforeEach(() => {
    // Initialize a player instance before each test
    player = new Player("socket-1", "automatic");
  });

  it("should initialize with the given socketId and mode", () => {
    expect(player.getSocketId()).toBe("socket-1");
    expect(player.getMode()).toBe("automatic");
    expect(player.getNumber()).toBeNull();
  });

  it("should generate a random first move", () => {
    Math.random = jest.fn(() => 0.3);

    const firstMoveResult = player.firstMove();
    const generatedNumber = player.getNumber();

    expect(firstMoveResult).toBe(301);
    expect(generatedNumber).toBe(301);
  });

  it("should make a move and return the correct MoveDto", () => {
    const moveResult: MoveDto = player.makeMove(501);

    expect(moveResult.givenNumber).toBe(501);
    expect(moveResult.added).toBe(0);
    expect(moveResult.resultingNumber).toBe(167);
    expect(moveResult.mode).toBe("automatic");
  });

  it("should make a manual move and return the correct MoveDto", () => {
    const moveResult: MoveDto = player.makeManualMove(501, 0);

    expect(moveResult.givenNumber).toBe(501);
    expect(moveResult.added).toBe(0);
    expect(moveResult.resultingNumber).toBe(167);
    expect(moveResult.mode).toBe("automatic");
  });
});
