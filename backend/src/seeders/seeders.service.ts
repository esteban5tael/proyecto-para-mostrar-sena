import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { CategoriesService } from '../categories/categories.service.js';
import { ProductsService } from '../products/products.service.js';

/**
 * Datos semilla. Se mantienen los productos agrupados por categoría para
 * que sea fácil leerlos y saber a qué categoría pertenece cada uno.
 */
const CATEGORIES_SEED: Array<{ name: string; description: string }> = [
  { name: 'Tecnología', description: 'Dispositivos electrónicos, gadgets y más.' },
  { name: 'Hogar', description: 'Muebles, decoración y utensilios para tu casa.' },
  { name: 'Deportes', description: 'Equipos y accesorios para hacer deporte.' },
  { name: 'Ropa', description: 'Prendas y calzado para toda ocasión.' },
  { name: 'Libros', description: 'Libros de programación, novelas y más.' },
];

/**
 * Cada producto apunta con `categoryIndex` a su categoría dentro de
 * `CATEGORIES_SEED` (0 = Tecnología, 1 = Hogar, ...). Así no repetimos IDs.
 */
const PRODUCTS_SEED: Array<{
  categoryIndex: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}> = [
  // ── Tecnología (0) ──────────────────────────────────────────
  { categoryIndex: 0, name: 'Laptop Pro 15', description: 'Laptop de alto rendimiento.', price: 1500.0, stock: 10 },
  { categoryIndex: 0, name: 'Mouse Ergonómico', description: 'Mouse inalámbrico.', price: 45.5, stock: 50 },
  { categoryIndex: 0, name: 'Monitor 4K 27"', description: 'Monitor UHD 144Hz.', price: 350.0, stock: 15 },
  { categoryIndex: 0, name: 'Teclado Mecánico RGB', description: 'Teclado mecánico retroiluminado.', price: 89.99, stock: 30 },
  { categoryIndex: 0, name: 'Audífonos Bluetooth', description: 'Audífonos inalámbricos con cancelación de ruido.', price: 120.0, stock: 25 },

  // ── Hogar (1) ───────────────────────────────────────────────
  { categoryIndex: 1, name: 'Silla de Oficina', description: 'Silla ergonómica.', price: 120.0, stock: 20 },
  { categoryIndex: 1, name: 'Escritorio de Madera', description: 'Escritorio de 1.5m.', price: 250.0, stock: 8 },
  { categoryIndex: 1, name: 'Lámpara LED', description: 'Lámpara con luz regulable.', price: 30.0, stock: 40 },
  { categoryIndex: 1, name: 'Sofá 3 Puestos', description: 'Sofá de tela para sala.', price: 600.0, stock: 5 },
  { categoryIndex: 1, name: 'Mesa de Centro', description: 'Mesa de centro en madera.', price: 180.0, stock: 12 },

  // ── Deportes (2) ────────────────────────────────────────────
  { categoryIndex: 2, name: 'Balón de Fútbol', description: 'Balón profesional número 5.', price: 25.0, stock: 60 },
  { categoryIndex: 2, name: 'Bicicleta de Montaña', description: 'Bicicleta con 21 cambios.', price: 450.0, stock: 7 },
  { categoryIndex: 2, name: 'Mancuernas 10kg', description: 'Par de mancuernas ajustables.', price: 55.0, stock: 30 },
  { categoryIndex: 2, name: 'Tapete de Yoga', description: 'Tapete antideslizante.', price: 35.0, stock: 45 },
  { categoryIndex: 2, name: 'Raqueta de Tenis', description: 'Raqueta de aluminio.', price: 90.0, stock: 18 },

  // ── Ropa (3) ────────────────────────────────────────────────
  { categoryIndex: 3, name: 'Camiseta Deportiva', description: 'Camiseta transpirable.', price: 22.0, stock: 100 },
  { categoryIndex: 3, name: 'Jeans Clásicos', description: 'Jeans de corte recto.', price: 60.0, stock: 40 },
  { categoryIndex: 3, name: 'Chaqueta Impermeable', description: 'Chaqueta para lluvia.', price: 130.0, stock: 15 },
  { categoryIndex: 3, name: 'Zapatillas Running', description: 'Zapatillas para correr.', price: 95.0, stock: 35 },
  { categoryIndex: 3, name: 'Gorra Ajustable', description: 'Gorra con cierre ajustable.', price: 18.0, stock: 80 },

  // ── Libros (4) ──────────────────────────────────────────────
  { categoryIndex: 4, name: 'Clean Code', description: 'Buenas prácticas de programación.', price: 45.0, stock: 20 },
  { categoryIndex: 4, name: 'El Principito', description: 'Clásico de la literatura.', price: 15.0, stock: 60 },
  { categoryIndex: 4, name: 'Hábitos Atómicos', description: 'Cómo construir buenos hábitos.', price: 35.0, stock: 40 },
  { categoryIndex: 4, name: 'Cien Años de Soledad', description: 'Novela de Gabriel García Márquez.', price: 28.0, stock: 25 },
  { categoryIndex: 4, name: 'Sapiens', description: 'Breve historia de la humanidad.', price: 40.0, stock: 30 },
];

@Injectable()
export class SeedersService {
  private readonly logger = new Logger('SeedersService');

  constructor(
    // Para borrar las tablas de forma limpia usamos el DataSource
    private readonly dataSource: DataSource,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    // Usamos los servicios existentes para crear los datos (reutilizamos lógica)
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  async resetAndSeed() {
    this.logger.warn('🚨 Iniciando reseteo de la base de datos y seeding...');

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // ─────────────────────────────────────────────────────────
      // 1. LIMPIAR LA BASE DE DATOS
      // ─────────────────────────────────────────────────────────
      // `queryRunner` nos permite ejecutar SQL crudo y transacciones de forma segura.
      await queryRunner.connect();

      // La tabla pivote `product_categories` pertenecía a la relación
      // ManyToMany anterior. Ya no se usa (ahora la FK `category_id` vive en
      // `products`), así que la eliminamos si quedó huérfana en la BD.
      await queryRunner.query('DROP TABLE IF EXISTS "product_categories" CASCADE');

      // `TRUNCATE ... CASCADE` es el estándar de PostgreSQL para vaciar tablas
      // y reiniciar secuencias, arrastrando las dependencias (FKs).
      // Nota: como usamos UUID, `RESTART IDENTITY` no afecta, pero es buena práctica.
      await queryRunner.query('TRUNCATE TABLE "products" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "categories" CASCADE');

      this.logger.log('🗑️  Base de datos vaciada correctamente.');

      // ─────────────────────────────────────────────────────────
      // 2. INSERTAR DATOS NUEVOS
      // ─────────────────────────────────────────────────────────
      this.logger.log('Creando categorías...');
      const createdCategories: Category[] = [];
      for (const data of CATEGORIES_SEED) {
        const category = await this.categoriesService.create({
          ...data,
          isActive: true,
        });
        createdCategories.push(category);
      }

      this.logger.log(
        `✅ Categorías creadas: ${createdCategories.map((c) => c.name).join(', ')}`,
      );

      // ─────────────────────────────────────────────────────────
      // 3. PRODUCTOS (5 por cada categoría)
      // ─────────────────────────────────────────────────────────
      this.logger.log('Creando productos...');
      for (const item of PRODUCTS_SEED) {
        const category = createdCategories[item.categoryIndex];

        await this.productsService.create({
          name: item.name,
          description: item.description,
          price: item.price,
          stock: item.stock,
          categoryId: category.id,
        });
      }

      this.logger.log(`✅ Productos creados: ${PRODUCTS_SEED.length}`);
      this.logger.log('🎉 ¡Sembrado completado con éxito!');

      // Devolvemos un resumen para la respuesta HTTP
      return {
        message: 'Base de datos reseteada y poblada con éxito',
        categoriesCreated: createdCategories.length,
        productsCreated: PRODUCTS_SEED.length,
      };

    } catch (error) {
      this.logger.error('❌ Error durante el sembrado:', error);
      throw new InternalServerErrorException(
        'Error al resetear y sembrar la base de datos. Revisa los logs del servidor.',
      );
    } finally {
      // Siempre liberar el query runner para no dejar conexiones colgadas
      await queryRunner.release();
    }
  }
}
