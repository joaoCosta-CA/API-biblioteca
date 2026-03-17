import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { DRIZZLE } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { UpdateMemberDto } from './dto/update-member.dto';
import { members } from '../db/schema';
import { desc, eq } from 'drizzle-orm';

@Injectable()
export class MembersService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,){}

  async create(createMemberDto: CreateMemberDto) {
    try{
      const result = await this.db
      .insert(members)
      .values(createMemberDto)
      .returning();

    return result[0];
    }catch(error){
      if(error.code === '23505'){
        throw new ConflictException('Email ou numero de matricula já cadastrado');
      }
      throw error;
    }

  }

  async findAll() {
    return await this.db
    .select()
    .from(members)
    .orderBy(desc(members.createdAt));
  }

  async findOne(id: number) {
    const result = await this.db
      .select()
      .from(members)
      .where(eq(members.id, id))
    if (result.length === 0) {
      throw new NotFoundException(`Membro com id ${id} não encontrado`);
    }
    return result[0];
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    const result = await this.db
      .update(members)
      .set(updateMemberDto)
      .where(eq(members.id, id))
      .returning();
      
    if (result.length === 0) {
      throw new NotFoundException(`Membro com id ${id} não encontrado`);
    }
    return result[0];
  }

  async remove(id: number) {
    const result = await this.db
      .delete(members)
      .where(eq(members.id, id))
      .returning();

    if (result.length === 0) {
      throw new NotFoundException(`Membro com id ${id} não encontrado`);
    }

    return result[0];
  }
}
