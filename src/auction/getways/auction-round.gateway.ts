import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuctionService } from '../auction.service';
@WebSocketGateway({
	namespace: 'bingo',
	cors: true,
})
export class AuctionRoundGateway {
	@WebSocketServer() server: Server;

	constructor(private readonly auctionService: AuctionService) {}

	private broadcastRoundUpdate(auction_id: string, roundData: any) {
		this.server.to(`auction_round_${auction_id}`).emit('round_state', roundData);
	}

	@SubscribeMessage('join_auction_round')
	async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() auction_id: string) {
		const activeRound = await this.auctionService.findOneRoundActive(auction_id);
		client.join(`auction_round_${auction_id}`);
		client.emit('round_state', { round: activeRound, bids: activeRound.bids });
		return activeRound;
	}

	@SubscribeMessage('leave_auction_round')
	handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() auction_id: string) {
		client.leave(`auction_round_${auction_id}`);
	}

	/* @SubscribeMessage('update_round')
	async handleRoundUpdate(@ConnectedSocket() client: Socket, @MessageBody() data: { bingoId: string; roundId: string }) {
		const { bingoId, roundId } = data;

		const updatedRound = await this.auctionService.getRoundById(roundId);

		// Broadcast the update to all clients in the room
		this.broadcastRoundUpdate(bingoId, updatedRound);

		return updatedRound;
	} */

	@SubscribeMessage('new_bid')
	async handleNewBid(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { roundId: string; auctionId: string; userId: string; amount: number }
	) {
		const { roundId, auctionId, userId, amount } = data;

		try {
			const { updatedRound, bids } = await this.auctionService.processBid(roundId, userId, amount);
      
      this.broadcastRoundUpdate(auctionId, { round: updatedRound, bids });
      
			return { round: updatedRound, bids };
		} catch (error) {
			client.emit('bid_rejected', { reason: error.message });
		}
	}
}
