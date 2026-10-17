import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { Category } from './entities/category.entity.js';

/**
 * El Controller SOLO se ocupa de HTTP:
 *  - leer params/body
 *  - delegar al service
 *  - devolver la respuesta o dejar que Nest lance la excepción
 *
 * Aquí no va lógica de negocio. Regla de oro.
 */
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una categoría' })
  @ApiCreatedResponse({ type: Category })
  create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las categorías' })
  @ApiOkResponse({ type: [Category] })
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  /**
   * `ParseUUIDPipe` valida que el :id sea UUID v4 válido.
   * Si no lo es, responde 400 sin llegar al service.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por id' })
  @ApiOkResponse({ type: Category })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.categoriesService.findOne(id);
  }

  /**
   * Endpoint extra: buscar por slug (útil para rutas públicas tipo
   * `/categories/slug/muebles`). No lo pide el CRUD básico pero es
   * altamente recomendable cuando manejas slugs.
   */
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener una categoría por slug' })
  @ApiOkResponse({ type: Category })
  findBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiOkResponse({ type: Category })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 en vez del 200 por defecto
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiNoContentResponse({ description: 'Categoría eliminada' })
  @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
  async remove(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    await this.categoriesService.remove(id);
  }
}
