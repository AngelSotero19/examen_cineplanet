// database.service.ts
import { Injectable } from '@nestjs/common';
import { ConnectionPool, config } from 'mssql';

@Injectable()
export class DatabaseService {
  private pool: ConnectionPool;

  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      const dbConfig = {
        user: '', 
        password: '',
        server: 'DESKTOP-3UKN2O5\\SQLEXPRESS',
        database: 'Prueba', 
        options: {
          trustServerCertificate: true, 
        },
      };

      this.pool = await new ConnectionPool(dbConfig).connect();
      console.log('Connected to SQL Server');
    } catch (error) {
      console.error('Error connecting to SQL Server:', error.message);
    }
  }

  async executeQuery(query: string): Promise<any> {
    try {
      const result = await this.pool.query(query);
      return result.recordset;
    } catch (error) {
      console.error('Error executing query:', error.message);
      throw new Error('Error executing query');
    }
  }

  
}
