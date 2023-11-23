// commerce.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../service/database.service';


@Injectable()
export class CommerceService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findCommerceById(commerceId: string): Promise<any> {
    const query = `SELECT * FROM Commerce WHERE id = '${commerceId}'`;
    const result = await this.databaseService.executeQuery(query);
    return result;
  }
}
