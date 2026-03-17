import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
