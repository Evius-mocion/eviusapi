import { Module } from "@nestjs/common";
import { LocationService } from "./location.service";
import { LocationController } from "./location.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Country } from "./entities/country.entity";
import { Department } from "./entities/department.entity";
import { City } from "./entities/city.entity";

@Module({
  controllers: [LocationController],
  providers: [LocationService],
  imports: [TypeOrmModule.forFeature([Country, Department, City])],
})
export class LocationModule {}
