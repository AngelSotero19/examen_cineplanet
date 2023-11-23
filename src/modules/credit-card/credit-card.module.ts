// credit-card.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCard } from '../../entities/credit-card.entity';
import { CardService } from './credit-card.service';
import { CommerceModule } from '../comerce/commerce.module';

@Module({
  imports: [TypeOrmModule.forFeature([CreditCard]), CommerceModule],
  providers: [CardService],
  exports: [CardService],
})
export class CreditCardModule {}
