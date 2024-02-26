import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MenuModule } from "./modules/security/menu/menu.module";
import { RoleModule } from "./modules/security/role/role.module";
import { UserModule } from "./modules/security/user/user.module";
import { LoggingInterceptor } from "./common/interceptors/logging/logging.interceptor";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { CustomLogger } from "./common/services/custom.logger";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),
    // MenuModule,
    // RoleModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService,
    CustomLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    }
  ], 
  exports: [CustomLogger]
})
export class AppModule { }
