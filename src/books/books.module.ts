import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  exports: [BooksService],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
