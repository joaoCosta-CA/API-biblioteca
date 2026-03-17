import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const books = pgTable('books', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  publishedYear: integer('published_year'),
  totalCopies: integer('total_copies').notNull(),
  availableCopies: integer('available_copies').notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(), // e-mail único 
  registrationNumber: varchar('registration_number', { length: 50 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  bookId: integer('book_id').references(() => books.id).notNull(),
  memberId: integer('member_id').references(() => members.id).notNull(),
  loanDate: timestamp('loan_date').defaultNow().notNull(),
  dueDate: timestamp('due_date').notNull(),
  returnDate: timestamp('return_date'), // Fica nulo até o livro ser devolvido
  status: varchar('status', { length: 20 }).default('active').notNull(), // active, returned, overdue
});