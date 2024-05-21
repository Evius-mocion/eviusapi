import { Module } from "@nestjs/common";
import { OrganizationModule } from "./organization/organization.module";
import { EventModule } from "./event/event.module";
import { ColaboratorModule } from "./collaborator/collaborator.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "./common/guards/auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { JWT_SECRET } from "./constants/constants";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
    }),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: "5h" },
    }),
    OrganizationModule,
    EventModule,
    ColaboratorModule,
  ],
  controllers: [],
  providers: [
    {
      provide: "APP_GUARD",
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
