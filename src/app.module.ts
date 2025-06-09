import { Module } from '@nestjs/common';
import { OrganizationModule } from "./organization/organization.module";
import { EventModule } from "./event/event.module";
import { CollaboratorModule } from "./collaborator/collaborator.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "./common/guards/auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { RolesGuard } from "./common/guards/roles.guard";
import { attendeeModule } from "./attendee/attendee.module";
import { ExperiencesModule } from "./experiences/experiences.module";
import { StationsModule } from "./stations/stations.module";
import { LocationModule } from "./location/location.module";
import * as fs from 'fs';
import { RequestIpModule } from "nest-request-ip";
import { ActivitiesModule } from './activities/activities.module';
import { SurveyModule } from './survey/survey.module';
import { AuctionModule } from './auction/auction.module';
import { BingoModule } from './bingo/bingo.module';
import { ElementHuntGameModule } from "./element-hunt-game/element-hunt-game.module";
import { MillionaireModule } from './millionaire/millionaire.module';
import { NetworkingModule } from './networking/networking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        synchronize: true, // set to false in production
        autoLoadEntities: true, // load all entities from the entities folder
        logging: false,
        ssl: process.env.PRODUCTION === "true" ? {
          ca: fs.readFileSync(process.env.SSL_CERTIFICATE_PATH).toString(), // read the SSL certificate from the file path, you need donwload the certificate from the database connection settings in digital ocean
        } : false,
        extra: {
          timezone: "utc",
        }
      }),
    }), 
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "5h" },
      }),
    }),
    RequestIpModule.forRoot({
      localIpAddress: "167.0.239.51", // this ip is used when the request is local
    }),
    OrganizationModule,
    EventModule,
    CollaboratorModule,
    attendeeModule,
    ExperiencesModule,
    StationsModule,
    LocationModule,
    ActivitiesModule,
    SurveyModule,
    AuctionModule,
    BingoModule,
    ElementHuntGameModule,
    MillionaireModule,
    NetworkingModule
  ],
  controllers: [],
  providers: [
    {
      provide: "APP_GUARD",
      useClass: AuthGuard,
    },
    {
      provide: "APP_GUARD",
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
