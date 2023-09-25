import { Server } from "socket.io";
import http from "http";

const WEBSOCKET_CORS = {
  origin: "*",
};

class Websocket extends Server {
  private static io: Websocket;

  constructor(httpServer: http.Server) {
    super(httpServer, {
      cors: WEBSOCKET_CORS,
    });
  }

  public static getInstance(httpServer: http.Server): Websocket {
    if (!Websocket.io) {
      Websocket.io = new Websocket(httpServer);
    }

    return Websocket.io;
  }
}

export default Websocket;
