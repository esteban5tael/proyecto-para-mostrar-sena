import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SeedersService } from './seeders.service.js';

@ApiTags('Seeders')
@Controller('seeders')
export class SeedersController {
  constructor(private readonly seedersService: SeedersService) {}

  /**
   * Endpoint de un solo uso para desarrollo.
   * ⚠️ NUNCA exponer en producción sin autenticación.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Resetear y sembrar la base de datos',
    description: 'Vacía las tablas y crea 5 categorías con 5 productos cada una (25 productos).',
  })
  run() {
    return this.seedersService.resetAndSeed();
  }
}