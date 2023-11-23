import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardService } from './modules/credit-card/credit-card.service';
import { DatabaseService  } from '../../secure-card/src/service/database.service'; 
import { CreditCard } from './entities/credit-card.entity'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'DESKTOP-3UKN2O5\\SQLEXPRESS',
      database: 'Prueba',
      synchronize: true,
      logging: true,
      entities: [CreditCard],
      extra: {
        trustServerCertificate: true,
        encrypt: true,
        trustedConnection: true,
      },
    }),
    
    TypeOrmModule.forFeature([CardService]),
  ],
  controllers: [AppController],
  providers: [AppService, CardService, DatabaseService ], 
})
export class AppModule {}
