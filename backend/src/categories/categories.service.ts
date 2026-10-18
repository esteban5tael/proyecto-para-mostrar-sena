import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { Category } from './entities/category.entity.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Crea una categoría y devuelve la entidad COMPLETA, incluida la
   * relación `products` (vacía para una categoría recién creada), de
   * modo que la respuesta de `POST` tenga la misma forma que la de
   * `GET` y `PATCH`.
   *
   * @param dto - Datos de creación ya validados por class-validator
   * @returns La categoría persistida con sus productos
   * @throws {ConflictException} Si ya existe otra categoría con el mismo
   * `slug` o `name`
   */
  async create(dto: CreateCategoryDto): Promise<Category> {
    const slug = dto.slug ?? this.slugify(dto.name);
    const existing = await this.categoryRepository.findOne({
      where: [{ slug }, { name: dto.name }],
    });
    if (existing) {
      throw new ConflictException(`Ya existe la categoría con ese nombre o slug`);
    }

    const category = this.categoryRepository.create({
      ...dto,
      slug,
      description: dto.description ?? null,
      isActive: dto.isActive ?? true,
    });

    const saved = await this.categoryRepository.save(category);

    // `save()` no recarga las relaciones `eager` en el INSERT, así que la
    // respuesta se compone con una lectura por id: así `products` viaja en
    // el 201 igual que en GET y PATCH.
    return this.findOneRegardlessStatus(saved.id);
  }

  /**
   * Lista SOLO las categorías activas.
   *
   * Usamos QueryBuilder en vez de `find()` por dos razones:
   *  1. Filtrar las categorías por `isActive = true`.
   *  2. Filtrar también, dentro del JOIN, los productos desactivados para
   *     que no se cuelen en la respuesta de la relación `products`.
   *
   * NOTA: con QueryBuilder las relaciones `eager` se desactivan, por eso
   * hacemos el `leftJoinAndSelect` de `products` de forma explícita.
   */
  async findAll(): Promise<Category[]> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect(
        'category.products',
        'product',
        'product.isActive = :isActive',
        { isActive: true },
      )
      .where('category.isActive = :isActive', { isActive: true })
      .orderBy('category.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Obtiene una categoría ACTIVA por id (con sus productos activos).
   * Si la categoría está desactivada se comporta como si no existiera: 404.
   */
  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect(
        'category.products',
        'product',
        'product.isActive = :isActive',
        { isActive: true },
      )
      .where('category.id = :id', { id })
      .andWhere('category.isActive = :isActive', { isActive: true })
      .getOne();

    if (!category) {
      throw new NotFoundException(`Categoría con id "${id}" no encontrada`);
    }
    return category;
  }

  /**
   * Obtiene una categoría ACTIVA por slug (con sus productos activos).
   * Una categoría desactivada responde 404 igual que `findOne`.
   */
  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect(
        'category.products',
        'product',
        'product.isActive = :isActive',
        { isActive: true },
      )
      .where('category.slug = :slug', { slug })
      .andWhere('category.isActive = :isActive', { isActive: true })
      .getOne();

    if (!category) {
      throw new NotFoundException(
        `Categoría con slug "${slug}" no encontrada`,
      );
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    // Leemos SIN filtrar isActive: así se puede reactivar una categoría
    // desactivada con un PATCH { isActive: true }.
    const category = await this.findOneRegardlessStatus(id);

    // Si el PATCH desactiva la categoría, aplicamos la misma cascada que
    // en remove(): la categoría y sus productos dejan de aparecer juntos.
    if (category.isActive && dto.isActive === false) {
      await this.deactivateWithProducts(category);
    }

    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  /**
   * SOFT DELETE LÓGICO CON CASCADA
   *
   * En lugar de `repository.remove()` o `delete()`, cambiamos `isActive`
   * a false. Además, desactivamos en cascada TODOS los productos de la
   * categoría para que tampoco aparezcan en las consultas.
   *
   * (Reactivar la categoría NO reactiva los productos: se hace uno a uno
   * desde el endpoint de productos, para no revivir los que se
   * desactivaron a propósito.)
   */
  async remove(id: string): Promise<{ id: string; deleted: true }> {
    const category = await this.findOneRegardlessStatus(id);
    await this.deactivateWithProducts(category);

    return { id, deleted: true };
  }

  /**
   * Busca una categoría por id SIN filtrar por isActive.
   *
   * Es de uso interno: `update()` y `remove()` necesitan leer también las
   * categorías desactivadas (para reactivarlas o para cascadear).
   *
   * Gracias a que la relación `products` es `eager: true`, esta consulta ya
   * trae los productos asociados.
   */
  private async findOneRegardlessStatus(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Categoría con id "${id}" no encontrada`);
    }
    return category;
  }

  /**
   * Desactiva una categoría y, en cascada, todos sus productos.
   *
   * Los dos updates van dentro de una transacción: o se desactiva la
   * categoría y sus productos, o no se desactiva nada (evita quedar con
   * productos huérfanos visibles si algo falla a mitad de camino).
   *
   * Gracias a la FK `category_id` actualizamos los productos directamente,
   * sin necesidad de cargar la relación.
   */
  private async deactivateWithProducts(category: Category): Promise<void> {
    await this.categoryRepository.manager.transaction(async (manager) => {
      await manager.update(Category, { id: category.id }, { isActive: false });

      await manager.update(
        Product,
        { categoryId: category.id },
        { isActive: false },
      );
    });
  }

  private slugify(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  }
}
