import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './shared/configuration';
import { CategoryModule } from './category/category.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ProductModule,
    CategoryModule,
    SharedModule,
    UserModule,
  ],
})
export class AppModule {}
