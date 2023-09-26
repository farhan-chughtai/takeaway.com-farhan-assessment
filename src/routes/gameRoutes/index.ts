import { Request, Response, NextFunction, Router } from "express";
import { GameService } from "../../domain/services/GameService";
import { Player } from "../../domain/entities/Player";
const gameRouter = Router();

gameRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.render("game");
});

export default gameRouter;
