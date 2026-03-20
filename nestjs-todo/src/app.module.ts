import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { Task } from './modules/task/task.entity';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { Receipt } from './receipts/receipt.entity';
import { ReceiptsModule } from './receipts/receipts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'todo.sqlite',
      entities: [User, Task, Receipt],
      // Removed duplicate entities line
      synchronize: true, // only for development
    }),
    UserModule,
    TaskModule,
    ReceiptsModule,
  ],
})
export class AppModule {}
