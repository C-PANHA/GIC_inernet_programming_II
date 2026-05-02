import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  create(data: Partial<Product>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  findAll() {
    return this.repo.find({ relations: ['category'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['category'] });
  }

  findByCategory(categoryId: number) {
    return this.repo.find({ where: { categoryId }, relations: ['category'] });
  }
}
