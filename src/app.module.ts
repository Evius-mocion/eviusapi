import { Module } from "@nestjs/common";
import { OrganizationModule } from "./organization/organization.module";
import { EventModule } from "./event/event.module";
import { CollaboratorModule } from "./collaborator/collaborator.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "./common/guards/auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { RolesGuard } from "./common/guards/roles.guard";
import { AssistantModule } from "./assistant/assistant.module";
import { ExperiencesModule } from "./experiences/experiences.module";
import { StationsModule } from "./stations/stations.module";
import { LocationModule } from "./location/location.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "5h" },
      }),
    }),
    OrganizationModule,
    EventModule,
    CollaboratorModule,
    AssistantModule,
    ExperiencesModule,
    StationsModule,
    LocationModule,
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
