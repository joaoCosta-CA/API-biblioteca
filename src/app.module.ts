import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';
import { LoansModule } from './loans/loans.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [BooksModule, MembersModule, LoansModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env'})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
