import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './entities/product.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    // Inyectamos el repo de categorías para validar que la categoría exista
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    // 1. Validar que la categoría exista Y esté activa.
    //    Si está desactivada, el producto no debe poder usarla.
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId, isActive: true },
    });

    if (!category) {
      throw new BadRequestException(
        'La categoría enviada no existe o está desactivada',
      );
    }

    // 2. Crear el producto asociado a esa única categoría
    const product = this.productRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      stock: dto.stock,
      isActive: dto.isActive ?? true,
      categoryId: category.id,
      category, // TypeORM usa esto para poblar la FK
    });

    return this.productRepository.save(product);
  }

  /**
   * Lista SOLO los productos activos cuya categoría también está activa.
   *
   * Usamos QueryBuilder para:
   *  1. Filtrar los productos desactivados.
   *  2. Filtrar las categorías desactivadas en el JOIN, para que un producto
   *     nunca se muestre colgado de una categoría inactiva.
   *
   * NOTA: `innerJoinAndSelect` descarta los productos cuya categoría no
   * cumple la condición (comportamiento deseado aquí).
   */
  async findAll(): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect(
        'product.category',
        'category',
        'category.isActive = :isActive',
        { isActive: true },
      )
      .where('product.isActive = :isActive', { isActive: true })
      .orderBy('product.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Obtiene un producto ACTIVO por id (con su categoría activa).
   * Un producto desactivado responde 404: no aparece en ninguna consulta.
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect(
        'product.category',
        'category',
        'category.isActive = :isActive',
        { isActive: true },
      )
      .where('product.id = :id', { id })
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getOne();

    if (!product) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    // Leemos SIN filtrar isActive: así se puede reactivar un producto
    // desactivado con un PATCH { isActive: true }.
    const product = await this.findOneRegardlessStatus(id);

    // Si envían una nueva categoría, validar que exista Y esté activa
    if (dto.categoryId !== undefined) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId, isActive: true },
      });
      if (!category) {
        throw new BadRequestException(
          'La categoría no existe o está desactivada',
        );
      }
      product.categoryId = category.id;
      product.category = category;
    }

    // Asignar solo los campos que vienen
    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.stock !== undefined) product.stock = dto.stock;
    if (dto.isActive !== undefined) product.isActive = dto.isActive;

    return this.productRepository.save(product);
  }

  /**
   * SOFT DELETE LÓGICO
   *
   * En lugar de borrar el producto de la base de datos, lo marcamos con
   * `isActive = false`. A partir de ahí queda oculto en todas las consultas
   * (findAll / findOne), pero la fila y su relación se conservan.
   */
  async remove(id: string): Promise<{ id: string; deleted: true }> {
    const product = await this.findOneRegardlessStatus(id);

    product.isActive = false;
    await this.productRepository.save(product);

    return { id, deleted: true };
  }

  /**
   * Busca un producto por id SIN filtrar por isActive.
   *
   * Es de uso interno: `update()` y `remove()` necesitan leer también los
   * productos desactivados (para reactivarlos o para desactivarlos).
   */
  private async findOneRegardlessStatus(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }
    return product;
  }
}
