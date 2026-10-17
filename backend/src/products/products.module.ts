import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { Product } from './entities/product.entity.js';
import { Category } from '../categories/entities/category.entity.js';

@Module({
  imports: [
    // Necesitamos Category aquí para validar que los IDs existan al crear
    TypeOrmModule.forFeature([Product, Category]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}