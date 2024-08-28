import { Controller, Get, Param } from "@nestjs/common";
import { LocationService } from "./location.service";
import { Public } from "src/common/decorators";

@Controller("location")
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @Public()
  findAll() {
    return this.locationService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.locationService.findOne(+id);
  }
}
