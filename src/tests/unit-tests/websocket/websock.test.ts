import http from "http";
import { Server } from "socket.io";
import WebSocket from "../../../websocket/websocket";
import ioClient from "socket.io-client";

describe("WebSocket Server", () => {
  let httpServer: http.Server;
  let socketServer: Server;

  beforeAll((done) => {
    httpServer = http.createServer();
    socketServer = new Server(httpServer);

    httpServer.listen(() => {
      done();
    });
  });

  afterAll((done) => {
    socketServer.close(() => {
      httpServer.close(() => {
        done();
      });
    });
  });

  it("should establish a WebSocket connection", (done) => {
    const clientSocket = ioClient(
      `http://localhost:${(httpServer.address() as any).port}`
    );

    clientSocket.on("connect", () => {
      expect(clientSocket.connected).toBeTruthy();
      clientSocket.disconnect();
      done();
    });
  });

  it("should return the same instance using getInstance", () => {
    const instance1 = WebSocket.getInstance(httpServer);
    const instance2 = WebSocket.getInstance(httpServer);

    // Verify that both instances are the same
    expect(instance1).toBe(instance2);
  });
});
