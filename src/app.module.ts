import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromoConfig } from './entity/promo-config.entity';
import { PromoProgram } from './entity/promo-program.entity';
import { PromoTransaction } from './entity/promo-transaction.entity';
import { PromoConfigRepository } from './repository/promo-config.repository';
import { PromoProgramRepository } from './repository/promo-program.repository';
import { PromoTransactionRepository } from './repository/promo-transaction.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('MYSQL_HOST'),
        port: configService.get<number>('MYSQL_PORT'),
        username: configService.get<string>('MYSQL_USERNAME'),
        password: configService.get<string>('MYSQL_PASSWORD'),
        database: configService.get<string>('MYSQL_DATABASE'),
        entities: [PromoProgram, PromoConfig, PromoTransaction],
        dateStrings: true,
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PromoProgramRepository,
    PromoConfigRepository,
    PromoTransactionRepository,
  ],
})
export class AppModule {}
