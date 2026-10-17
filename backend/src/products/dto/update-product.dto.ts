import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto.js';

/**
 * PartialType hace todo opcional.
 * Si el usuario envía `categoryId`, se valida que sea un UUID v4 válido
 * y que la categoría exista y esté activa (eso se revisa en el service).
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}