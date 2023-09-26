import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import defaultRoutes from "./routes";
import http from "http";
import { Player } from "./domain/entities/Player";
import { GameService } from "./domain/services/GameService";
import Websocket from "./websocket/websocket";
import { PlayerRepo } from "./repositories/PlayerRepo";
import GameSocket from "./websocket/GameSocket";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const socketPort = process.env.SOCKET_PORT || 4000;
const server = http.createServer(app);

const io = Websocket.getInstance(server);
const { gameRouter } = defaultRoutes;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("view options", {
  layout: false,
});

app.use("/", gameRouter);

const playerRepo = new PlayerRepo();
new GameSocket(io, playerRepo);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

server.listen(socketPort, () => {
  console.log(
    `[socket]: Socket Server is running at http://localhost:${socketPort}`
  );
});
