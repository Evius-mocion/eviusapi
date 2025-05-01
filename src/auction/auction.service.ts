import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { Auction } from './entities/auction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { AuctionRound } from './entities/auction_round.entity';
import { Bid } from './entities/bid.entity';
import { Event } from 'src/event/entities/event.entity';
import { auctionStatusEnum, AuctionStatusRoundEnum, productStatusEnum } from './interfaces';
import { CreateProductAuctionDto } from './dto/create-product.dto';
import { UpdateProductAuctionDto } from './dto/update-product.dto';
import { UpdateRoundAuctionDto } from './dto/update-round.dto';
import { CreateRoundDto } from './dto/create-round.dto';

@Injectable()
export class AuctionService {
	constructor(
    private dataSource: DataSource,
		@InjectRepository(Auction)
		private readonly auctionRepository: Repository<Auction>,
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
		@InjectRepository(AuctionRound)
		private readonly roundRepository: Repository<AuctionRound>,
		@InjectRepository(Bid)
		private readonly bidRepository: Repository<Bid>,
		@InjectRepository(Event)
		private readonly eventRepository: Repository<Event>
	) {}

	async create(createAuctionDto: CreateAuctionDto) {
		const { event_id, ...auctionDto } = createAuctionDto;
		const event = await this.eventRepository.findOne({ where: { id: event_id }, select: ['id'] });

		if (!event) {
			throw new NotFoundException(`Event with ID ${event_id} not found`);
		}
		const newAuction = this.auctionRepository.create({
			...auctionDto,
			event,
		});
		const auction = await this.auctionRepository.save(newAuction);
		return {
			message: 'Auction created successfully',
			auction,
		};
	}



	async findAll(eventId: string) {
		const auctions = await this.auctionRepository.find({
			where: { event: { id: eventId } },
			select: ['id', 'name', 'created_at'],
		});

		return { auctions };
	}

	findOne(id: string) {
		const auction = this.auctionRepository.findOne({
			where: { id },
		});
		return { auction };
	}

	async update(id: string, updateAuctionDto: UpdateAuctionDto) {
    const { status , ...auctionDto } = updateAuctionDto;

    if (status) {
      throw new UnauthorizedException('you cannot update the status of the auction in this way');
    }

		const auction = await this.auctionRepository.findOne({
			where: { id },
		});
		if (!auction) {
			throw new NotFoundException(`Auction with ID ${id} not found`);
		}

		if (auction.status === auctionStatusEnum.ACTIVE) {
			throw new UnauthorizedException('Auction is active, cannot update');
		}

		const updatedAuction = await this.auctionRepository.save({
			...auction,
			...auctionDto,
		});

		return {
			message: 'Auction updated successfully',
			updatedAuction,
		};
	}

	async changeStatusAuction(id: string) {
    const auction = await this.auctionRepository.findOne({
      where: { id },
    })

    if (!auction) {
      throw new NotFoundException(`Auction with ID ${id} not found`);
    }

    const auctionUpdate = await this.auctionRepository.save({
      ...auction,
      status: auction.status === auctionStatusEnum.ACTIVE ? auctionStatusEnum.INACTIVE : auctionStatusEnum.ACTIVE,
    });
    return {
      message: 'Auction updated successfully',
      status: auctionUpdate.status,
    };
  }

async	remove(id: string) {
  	const result = await this.auctionRepository.delete(id);
  	if (!result.affected || result.affected === 0) {
    	throw new NotFoundException(`Auction with ID ${id} not found`);
  	}
  	return { message: 'Auction deleted successfully' };
	}


  // products 

  async createProduct(createProductDto: CreateProductAuctionDto) {
    const { auction_id, ...productDto } = createProductDto;
    const auction = await this.auctionRepository.findOne({
      where: { id: auction_id },
      select: ['id'],
    });
    if (!auction) {
      throw new NotFoundException(`Auction with ID ${auction_id} not found`);
    }

    const newProduct = this.productRepository.create({
      ...productDto,
      auction,
    });
    const product = await this.productRepository.save(newProduct);
    return {
      message: 'Product created successfully',
      product,
    };
    
  }
  async findAllProducts(auctionId: string) {
    const products = await this.productRepository.find({
      where: { auction: { id: auctionId } }
    });

    return { products };
  }

  async findOneProduct(id: string) {
  	const product = await this.productRepository.findOne({
      where:  { id }
    });

    return { product };

  }

  async updateProduct(id: string, updateProductDto: UpdateProductAuctionDto) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updatedProduct = await this.productRepository.save({
      ...product,
      ...updateProductDto,
    })
    
    return {
      message: 'Product updated successfully',
      updatedProduct,
    };
  }   

  async removeProduct(id: string) {
    const result = await this.productRepository.delete(id);
    if (!result.affected || result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return { message: 'Product deleted successfully' };
  }

  // rounds
  async createRound(createRoundDto: CreateRoundDto) {
    const { auction_id, product_id } = createRoundDto;
    const auction = await this.auctionRepository.findOne({
      where: { id: auction_id },
      select: {
        id: true,
        rounds: {
          status: true,
        },
        products: {
          id: true,
          status: true,
        },
      },
      relations: ['products','rounds'],
    });

    if (!auction) {
      throw new NotFoundException(`Auction with ID ${auction_id} not found`);
    }

   const roundActive =  auction.rounds.find((round) => round.status === AuctionStatusRoundEnum.IN_PROGRESS);

    if (roundActive) {
      throw new UnauthorizedException('Round active, cannot create a new round');
    }

    const product = auction.products.find((product) => product.id === product_id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${product_id} not found`);
    }

    if (product.status === productStatusEnum.SOLD) {
      throw new UnauthorizedException('Product sold, cannot use this product');
    }
    const newRound = this.roundRepository.create({
      status: AuctionStatusRoundEnum.IN_PROGRESS,
      product,
      start_time: new Date(),
      current_price: product.price,
      start_price: product.price,
      auction,
    });

    const round = await this.roundRepository.save(newRound);
    return {
      message: 'Round created successfully',
      round,
    };
  }

  async findAllRounds(auctionId: string) {
    const rounds = await this.roundRepository.find({
      where: { auction: { id: auctionId } },
      order: { start_time: 'DESC' },
    });

    return { rounds };
  }

  async findOneRound(id: string) {
    const round = await this.roundRepository.findOne({
      where: { id },
    });

    if (!round) {
      throw new NotFoundException(`Round with ID ${id} not found`);
    }

    return { round };
  }

  async findOneRoundActive(id: string) {
    const round = await this.roundRepository.findOne({
      where: { auction: {id} , status: AuctionStatusRoundEnum.IN_PROGRESS },
      cache: true,
      relations: {
        product: true,
      },
    });

    if (!round) {
      throw new NotFoundException(`Round with ID ${id} not found`);
    }
    
    return round ;
  }

  async updateRound(id: string, updateRoundDto: UpdateRoundAuctionDto) {
    const round = await this.roundRepository.findOne({
      where: { id },
    });

    if (!round) {
      throw new NotFoundException(`Round with ID ${id} not found`);
    }

    const updatedRound = await this.roundRepository.save({
      ...round,
      ...updateRoundDto,
    });

    return {
      message: 'Round updated successfully',
      round: updatedRound,
    };
  }

  async removeRound(id: string) {
    const result = await this.roundRepository.delete(id);
    if (!result.affected || result.affected === 0) {
      throw new NotFoundException(`Round with ID ${id} not found`);
    }
    return { message: 'Round deleted successfully' };
  }

// auction.service.ts
async processBid(roundId: string, attendee_id: string, amount: number): Promise<{ updatedRound: AuctionRound; bids: Bid[] }> {
  return await this.dataSource.transaction(async (manager) => {
    const roundRepo = manager.getRepository(AuctionRound);
    const bidRepo = manager.getRepository(Bid);

    // Obtener la ronda con lock para evitar condiciones de carrera
    const round = await roundRepo.findOne({ where: { id: roundId }, lock: { mode: 'pessimistic_write' } });

    if (!round) {
      throw new Error('Round not found');
    }

    if (amount <= round.current_price) {
      throw new Error('Bid must be higher than current price');
    }

    // Crear el nuevo bid
    const newBid = bidRepo.create({
      amount,
      round: { id: roundId },
      attendee: {id: attendee_id},
      product: {id: round.product.id},
      name: round.product.name,      
      email: '',
      auction : {id: round.auction.id},
    });
    await bidRepo.save(newBid);

    // Actualizar el precio actual del round
    round.current_price = amount;
    const updatedRound = await roundRepo.save(round);

    // Obtener los bids actualizados
    const bids = await bidRepo.find({
      where: { round: { id: roundId } },
      order: { created_at: 'DESC' },
    });

    return { updatedRound, bids };
  });
}


}
