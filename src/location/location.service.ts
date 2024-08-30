import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Country } from "./entities/country.entity";
import { Department } from "./entities/department.entity";
import { City } from "./entities/city.entity";
import { isUUID } from "class-validator";

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  //*----------------------------------------------------------------

  findAllCountries() {
    return this.countryRepository.find();
  }

  //*----------------------------------------------------------------
  async findStatesByCountry(countryKeyP: string) {
    const countryKey = decodeURIComponent(countryKeyP);

    let country: Country | undefined;

    if (isUUID(countryKey)) {
      country = await this.countryRepository.findOne({
        where: { id: countryKey },
      });
    } else {
      country = await this.countryRepository.findOne({
        where: [{ iso2: countryKey }, { name: countryKey }],
      });
    }

    if (!country) {
      throw new Error(`Country with key ${countryKey} not found`);
    }

    const states = await this.departmentRepository.find({
      where: { country: { id: country.id } },
    });
    return { states };
  }
  //*----------------------------------------------------------------
  async findCitiesByStateAndCountry(countryKeyP: string, stateKeyP: string) {
    const countryKey = decodeURIComponent(countryKeyP);
    const stateKey = decodeURIComponent(stateKeyP);

    let country: Country | undefined;
    let state: Department | undefined;

    // Buscar el país por id, iso2 o nombre
    if (isUUID(countryKey)) {
      country = await this.countryRepository.findOne({
        where: { id: countryKey },
      });
    } else {
      country = await this.countryRepository.findOne({
        where: [{ iso2: countryKey }, { name: countryKey }],
      });
    }

    if (!country) {
      throw new Error(`Country with key ${countryKey} not found`);
    }

    // Buscar el estado por id, iso2 o nombre
    if (isUUID(stateKey)) {
      state = await this.departmentRepository.findOne({
        where: { id: stateKey, country: { id: country.id } },
      });
    } else {
      state = await this.departmentRepository.findOne({
        where: [
          { iso2: stateKey, country: { id: country.id } },
          { name: stateKey, country: { id: country.id } },
        ],
      });
    }

    if (!state) {
      throw new Error(
        `State with key ${stateKey} not found in country ${country.name}`,
      );
    }

    const cities = await this.cityRepository.find({
      where: { state: { id: state.id } },
    });
    return cities;
  }

  async getCountriesWithPhoneCodes() {
    const countries = await this.countryRepository.find({
      order: { name: "ASC" },
    });
    return countries.map((country) => {
      return {
        id: country.id,
        name: country.name,
        phonecode: country.phonecode,
        flagPng: country.flag_png,
        flagSvg: country.flag_svg,
      };
    });
  }
}
