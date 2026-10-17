import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity.js';

/**
 * Entidad Product.
 * Regla de negocio: un producto DEBE tener UNA sola categoría.
 */
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price!: number;

  @Column({ type: 'int', default: 0 })
  stock!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  /**
   * FK explícita hacia `categories`.
   * La declaramos además de la relación para poder consultar y actualizar
   * por `categoryId` sin necesidad de hacer JOIN (por ejemplo, al desactivar
   * en cascada todos los productos de una categoría).
   *
   * `@JoinColumn` de la relación usa esta misma columna.
   */
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId!: string;

  /**
   * RELACIÓN MANY-TO-ONE
   * MUCHOS productos pertenecen a UNA sola categoría.
   *
   * Ya no existe tabla pivote: la FK vive directamente en `products`.
   * `eager: false` porque solo la traemos cuando la pedimos explícitamente.
   */
  @ManyToOne(() => Category, (category) => category.products, {
    eager: false,
    nullable: false,
    onDelete: 'CASCADE', // Si se borra la categoría (hard delete), sus productos también
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
