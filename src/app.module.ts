import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MenuModule } from "./modules/security/menu/menu.module";
import { RoleModule } from "./modules/security/role/role.module";
import { UserModule } from "./modules/security/user/user.module";
import { LoggingInterceptor } from "./services/logger/interceptors/logging.interceptor";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { CustomLogger } from "./services/logger/custom.logger";
import { HttpExceptionFilter } from "./services/exceptions-filter/http-exception.filter";
import { PermissionModule } from './modules/security/permission/permission.module';
import { RolePermissionModule } from './modules/security/role-permission/role-permission.module';
import { DataSourceConfig } from './common/config/data.source';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({...DataSourceConfig, autoLoadEntities: true}),
    RoleModule,
    UserModule,
    MenuModule,
    PermissionModule,
    RolePermissionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CustomLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }
  ], 
  exports: [CustomLogger]
})
export class AppModule { }
