import { Product } from '../../products/entities/product.entity.js';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Index('idx_categories_slug', { unique: true })
  @Column({ type: 'varchar', length: 120 })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  /**
   * RELACIÓN ONE-TO-MANY:
   * UNA categoría puede tener MUCHOS productos.
   *
   * `eager: true` significa que TypeORM cargará los `products` asociados
   * automáticamente en los `find()`/`findOne()`.
   *
   * OJO: `eager` se ignora cuando usas QueryBuilder; en ese caso hay que
   * pedir la relación con `leftJoinAndSelect`.
   */
  @OneToMany(() => Product, (product) => product.category, { eager: true })
  products!: Product[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
