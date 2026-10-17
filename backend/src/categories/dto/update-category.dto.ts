import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto.js';

/**
 * `PartialType` viene de @nestjs/swagger (o @nestjs/mapped-types).
 * Toma todos los campos de `CreateCategoryDto` y los vuelve opcionales,
 * además de heredar todas las validaciones y metadatos de Swagger.
 *
 * Resultado: un DTO con TODOS los campos opcionales, ideal para PATCH/PUT
 * parcial sin repetir decoradores.
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}