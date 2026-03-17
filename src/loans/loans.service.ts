import { Injectable, Inject } from '@nestjs/common';
import * as schema from '../db/schema';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { DRIZZLE } from 'src/db/db.module';
import { members } from '../db/schema';
import { BooksService } from '../books/books.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { eq, lt } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { desc } from 'drizzle-orm';
import { loans } from '../db/schema';
import { books } from '../db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class LoansService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>, private booksService: BooksService) { }

  async create(createLoanDto: CreateLoanDto) {
    const { bookId, memberId } = createLoanDto;

    const book = await this.booksService.findOne(bookId);
    if (book.availableCopies <= 0) {
      throw new BadRequestException('Não há cópias disponíveis para empréstimo');
    }

    const today = new Date();
    const overdueLoans = await this.db
      .select()
      .from(loans)
      .where(
        and(
          eq(loans.memberId, memberId),
          eq(loans.status, 'active'),
          lt(loans.dueDate, today) // Se a data de vencimento é menor que hoje
        )
      );

    if (overdueLoans.length > 0) {
      throw new BadRequestException(
        `Empréstimo bloqueado: o membro possui ${overdueLoans.length} livro(s) em atraso.`
      );
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const newLoan = await this.db.insert(loans).values({
      bookId,
      memberId,
      dueDate
    }).returning();

    await this.db.update(books).set({
      availableCopies: book.availableCopies - 1,
    }).where(eq(books.id, bookId));

    const activeLoans = await this.db
      .select()
      .from(loans)
      .where(and(eq(loans.memberId, createLoanDto.memberId), eq(loans.status, 'active')));

    if (activeLoans.length > 3) {
      throw new BadRequestException('O membro já possui 3 empréstimos ativos');
    }

    return newLoan[0];
  }

  async findAll() {
    return await this.db
      .select({
        id: loans.id,
        loanDate: loans.loanDate,
        returnDate: loans.returnDate,
        status: loans.status,
        book: {
          id: books.id,
          title: books.title,
          author: books.author,
        },
        member: {
          id: members.id,
          name: members.name,
          registrationNumber: members.registrationNumber,
        },
      })
      .from(loans)
      .leftJoin(books, eq(loans.bookId, books.id))
      .leftJoin(members, eq(loans.memberId, members.id))
      .orderBy(desc(loans.loanDate));
  }

  findOne(id: number) {
    return `This action returns a #${id} loan`;
  }

  update(id: number, updateLoanDto: UpdateLoanDto) {
    return `This action updates a #${id} loan`;
  }

  remove(id: number) {
    return `This action removes a #${id} loan`;
  }

  async returnLoan(loanId: number) {
    const loan = await this.db.select().from(loans).where(eq(loans.id, loanId)).limit(1);

    if (loan.length === 0 || loan[0].status === 'returned') {
      throw new BadRequestException('Empréstimo não encontrado ou já foi devolvido');
    }

    await this.db.update(loans).set({ status: 'returned', returnDate: new Date() }).where(eq(loans.id, loanId));

    const book = await this.booksService.findOne(loan[0].bookId);
    await this.db.update(books).set({ availableCopies: book.availableCopies + 1 }).where(eq(books.id, book.id));
  }

  

  async returnBook(loanId: number) {
  // 1. Busca o empréstimo pelo ID
  const loan = await this.db
    .select()
    .from(loans)
    .where(eq(loans.id, loanId))
    .limit(1);

  // 2. Valida se existe e se já não foi devolvido
  if (loan.length === 0) {
    throw new NotFoundException(`Empréstimo com ID ${loanId} não encontrado`);
  }

  if (loan[0].status === 'returned') {
    throw new BadRequestException('Este livro já foi devolvido anteriormente.');
  }

  // 3. Atualiza o status do empréstimo
  await this.db
    .update(loans)
    .set({
      status: 'returned',
      returnDate: new Date()
    })
    .where(eq(loans.id, loanId));

  // 4. Devolve a cópia ao estoque do livro
  const book = await this.booksService.findOne(loan[0].bookId);
  await this.db
    .update(books)
    .set({ availableCopies: book.availableCopies + 1 })
    .where(eq(books.id, book.id));

  return {
    message: 'Devolução realizada com sucesso!',
    bookTitle: book.title
  };
}

  async findOverdue() {
  const today = new Date();

  return await this.db
    .select({
      id: loans.id,
      bookTitle: books.title,
      memberName: members.name,
      dueDate: loans.dueDate
    })
    .from(loans)
    .innerJoin(books, eq(loans.bookId, books.id))
    .innerJoin(members, eq(loans.memberId, members.id))
    .where(
      and(
        eq(loans.status, 'active'),
        lt(loans.dueDate, today) // Filtra: Data de vencimento < Hoje
      )
    );
}
}
