import { Module } from '@nestjs/common';
import { CategoryResolver } from './resolvers/category.resolver';
import { ProductResolver } from './resolvers/product.resolver';
import { CategoryCodeFirstResolver } from './resolvers/category.codefirst.resolver';
import { ProductCodeFirstResolver } from './resolvers/product.codefirst.resolver';

import { CategoryModule } from '../modules/category/category.module';
import { ProductModule } from '../modules/product/product.module';

@Module({
  imports: [CategoryModule, ProductModule],
  providers: [
    // code-first resolvers (active with autoSchemaFile)
    CategoryCodeFirstResolver,
    ProductCodeFirstResolver,
  ],
})
export class GraphqlModule {}
