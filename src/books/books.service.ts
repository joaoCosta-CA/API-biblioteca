import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DRIZZLE } from 'src/db/db.module';
import { desc, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { books } from '../db/schema';

@Injectable()
export class BooksService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
  ) { }

  async create(createBookDto: CreateBookDto) {
    const result = await this.db
      .insert(books)
      .values(createBookDto)
      .returning();

    if (createBookDto.availableCopies > createBookDto.totalCopies) {
      throw new BadRequestException('Cópias disponíveis não podem ser maiores que o total de cópias');
    }

    return result[0];
  }

  async findAll() {
    return await this.db
      .select()
      .from(books)
      .orderBy(desc(books.createdAt));
  }

  async findOne(id: number) {
    const result = await this.db
      .select()
      .from(books)
      .where(eq(books.id, id))
    if (result.length === 0) {
      throw new NotFoundException(`Livro com id ${id} não encontrado`);
    }
    return result[0];
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const result = await this.db
      .update(books)
      .set(updateBookDto)
      .where(eq(books.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Livro com id ${id} não encontrado`);
    }

    return result[0];
  }

  async remove(id: number) {
    const result = await this.db
      .delete(books)
      .where(eq(books.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Livro com id ${id} não encontrado`);
    }

    return result[0];
  }
}
