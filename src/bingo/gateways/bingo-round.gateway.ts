import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { BingoRoundService } from '../services/bingo-round.service';
  @WebSocketGateway({
    namespace: 'bingo',
    cors: true,
  })
  export class BingoRoundGateway {
    @WebSocketServer() server: Server;
  
    constructor(private readonly bingoRoundService: BingoRoundService) {}
  
    private broadcastRoundUpdate(bingoId: string, roundData: any) {
      this.server.to(`bingo_round_${bingoId}`).emit('round_state', roundData);
    }
    
    @SubscribeMessage('join_round')
    async handleJoinRoom(
      @ConnectedSocket() client: Socket, 
      @MessageBody() bingoId: string,
    ) {
      const activeRound = await this.bingoRoundService.getActiveRound(bingoId);
      client.join(`bingo_round_${bingoId}`);
      client.emit('round_state', activeRound);
      return activeRound;
    }
    
    @SubscribeMessage('leave_round')
    handleLeaveRoom(
      @ConnectedSocket() client: Socket,
      @MessageBody() bingoId: string,
    ) {
      client.leave(`bingo_round_${bingoId}`);
    }
    
    @SubscribeMessage('update_round')
    async handleRoundUpdate(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { bingoId: string, roundId: string }
    ) {
        const { bingoId, roundId } = data;
        
        const updatedRound = await this.bingoRoundService.getRoundById(roundId);
        
        // Broadcast the update to all clients in the room
        this.broadcastRoundUpdate(bingoId, updatedRound);
        
        return updatedRound;
    }
}
  