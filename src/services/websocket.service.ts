import { WebSocketServer, WebSocket } from 'ws';

class WebSocketService {
  private wss: WebSocketServer;

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');

      ws.on('message', (message: string) => {
        console.log(`Received message: ${message}`);
        // Handle message and clear cache if necessary
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }

  broadcast(data: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}

export default WebSocketService;