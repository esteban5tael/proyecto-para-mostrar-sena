import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { Category } from './entities/category.entity.js';
import { Product } from '../products/entities/product.entity.js'; // Importamos la entidad

@Module({
  imports: [
    // Registramos AMBOS repositorios en este módulo
    TypeOrmModule.forFeature([Category, Product]), 
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}