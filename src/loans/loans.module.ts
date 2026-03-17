import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { DbModule } from '../db/db.module';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [BooksModule],
  controllers: [LoansController],
  providers: [LoansService],
})
export class LoansModule {}
