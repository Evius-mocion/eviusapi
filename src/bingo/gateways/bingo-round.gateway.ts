import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { BingoRoundService } from '../services/bingo-round.service';
import { Public } from 'src/common/decorators';
  
  @WebSocketGateway({
    namespace: 'bingo',
    cors: true,
  })
  export class BingoRoundGateway {
    @WebSocketServer() server: Server;
  
    constructor(private readonly bingoRoundService: BingoRoundService) {}
  
    private broadcastRoundUpdate(bingoId: string, roundData: any) {
      this.server.to(`bingo_round_${bingoId}`).emit('round_update', roundData);
    }
    
    @SubscribeMessage('join_round')
    async handleJoinRoom(
      @ConnectedSocket() client: Socket, 
      @MessageBody() bingoId: string,
    ) {
      console.log('join_round', bingoId);
      
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
  }
  