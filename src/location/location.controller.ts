import { Controller, Get, Param } from "@nestjs/common";
import { LocationService } from "./location.service";
import { Public } from "src/common/decorators";

@Controller("location")
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Public()
  @Get("/countries")
  findAllCountries() {
    return this.locationService.findAllCountries();
  }

  @Public()
  @Get("countries/:countryKey/states")
  findStatesByCountry(@Param("countryKey") countryKey: string) {
    return this.locationService.findStatesByCountry(countryKey);
  }
  @Public()
  @Get("countries/:countryKey/states/:stateKey/cities")
  findCitiesByStateAndCountry(
    @Param("countryKey") countryKey: string,
    @Param("stateKey") stateKey: string,
  ) {
    return this.locationService.findCitiesByStateAndCountry(countryKey, stateKey);
  }

  
  @Public()
  @Get('countries/phonecodes')
  async getCountriesWithPhoneCodes() {
    return this.locationService.getCountriesWithPhoneCodes();
  }


}
