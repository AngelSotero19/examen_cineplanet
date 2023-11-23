// app.controller.ts

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')  // Agrega esta ruta de salud para probar la conexión
  getHealth(): string {
    return 'Health Check';
  }
}
