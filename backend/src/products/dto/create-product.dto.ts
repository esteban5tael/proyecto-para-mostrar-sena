import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Silla Ergonómica Pro', description: 'Nombre del producto' })
  @IsString()
  @Length(2, 150)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name!: string;

  @ApiProperty({ example: 'Silla con soporte lumbar', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() || null : value))
  description?: string | null;

  @ApiProperty({ example: 199.99, description: 'Precio del producto' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number) // Asegura que si llega string se convierta a número
  price!: number;

  @ApiProperty({ example: 50, description: 'Stock disponible' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock!: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  isActive?: boolean;

  /**
   * ⭐ REGLA DE NEGOCIO CLAVE:
   * Un producto pertenece a UNA sola categoría, por eso es un único UUID
   * (ManyToOne) y no un arreglo.
   */
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID de la categoría a la que pertenece el producto',
  })
  @IsUUID('4', { message: 'categoryId debe ser un UUID v4 válido' })
  categoryId!: string;
}