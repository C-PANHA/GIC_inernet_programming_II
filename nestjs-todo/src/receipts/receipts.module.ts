import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyGuard } from 'src/common/guards/api.key.guards';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ReceiptsController } from './receipt.controller';
import { ReceiptsService } from './receipts.service';
import { Receipt } from './receipt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt]), NotificationsModule],
  controllers: [ReceiptsController],
  providers: [ReceiptsService, ApiKeyGuard],
})
export class ReceiptsModule {}
