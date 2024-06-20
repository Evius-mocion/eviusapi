import { Module } from "@nestjs/common";
import { OrganizationModule } from "./organization/organization.module";
import { EventModule } from "./event/event.module";
import { ColaboratorModule } from "./collaborator/collaborator.module";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "./common/guards/auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { RolesGuard } from "./common/guards/roles.guard";
import { AssistantModule } from './assistant/assistant.module';

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
    ColaboratorModule,
    AssistantModule,
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
