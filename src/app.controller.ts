import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener saludo de la API',
    description: 'Este endpoint retorna un saludo básico de la API',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
