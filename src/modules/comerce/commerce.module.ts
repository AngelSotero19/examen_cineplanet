// commerce.module.ts
import { Module } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';
import { CommerceService } from './commerce.service';

@Module({
  providers: [DatabaseService, CommerceService],
  exports: [CommerceService],
})
export class CommerceModule {}
