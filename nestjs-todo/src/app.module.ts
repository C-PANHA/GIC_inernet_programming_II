import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { Task } from './modules/task/task.entity';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { Category } from './modules/category/category.entity';
import { Product } from './modules/product/product.entity';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'todo.sqlite',
      entities: [User, Task, Category, Product],
      synchronize: true, // only for development
    }),

    // GraphQL: switchable between schema-first and code-first.
    // Currently use code-first (auto-schema generation).
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // schema-first: typePaths: [join(process.cwd(), 'src/graphql/schema/*.graphql')],
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      playground: true,
    }),

    UserModule,
    TaskModule,

    // feature modules
    CategoryModule,
    ProductModule,

    // graphql resolvers
    GraphqlModule,
  ],
})
export class AppModule {}
