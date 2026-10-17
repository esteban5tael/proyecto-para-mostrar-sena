import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersController } from './seeders.controller.js';
import { SeedersService } from './seeders.service.js';
import { Category } from '../categories/entities/category.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product]),
    CategoriesModule, // Para usar CategoriesService
    ProductsModule,   // Para usar ProductsService
  ],
  controllers: [SeedersController],
  providers: [SeedersService],
})
export class SeedersModule {}