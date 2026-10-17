import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // 👈 IMPORTA ESTO

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Muebles de Oficina',
    minLength: 2,
    maxLength: 100,
  }) // 👈 AGREGA ESTO
  @IsString({ message: 'name debe ser un string' })
  @Length(2, 100, { message: 'name debe tener entre 2 y 100 caracteres' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name!: string;

  @ApiPropertyOptional({
    description: 'Slug para la URL (si no se envía, se genera del nombre)',
    example: 'muebles-de-oficina',
    maxLength: 120,
  }) // 👈 AGREGA ESTO
  @IsOptional()
  @IsString()
  @MaxLength(120)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'slug solo permite minúsculas, números y guiones simples (sin guion al inicio/fin)',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  slug?: string;

  @ApiPropertyOptional({
    description: 'Descripción larga de la categoría',
    example: 'Todo lo relacionado con sillas, escritorios y más.',
    maxLength: 2000,
  }) // 👈 AGREGA ESTO
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'description no puede superar 2000 caracteres' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() || null : value,
  )
  description?: string | null;

  @ApiPropertyOptional({
    description: 'Indica si la categoría está activa',
    example: true,
    default: true,
  }) // 👈 AGREGA ESTO
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return value;
  })
  isActive?: boolean;
}