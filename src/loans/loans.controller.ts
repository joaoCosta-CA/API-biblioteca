import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  create(@Body() createLoanDto: CreateLoanDto) {
    return this.loansService.create(createLoanDto);
  }

  @Patch(':id/return')
  async returnBook(@Param('id') id: string){
    return await this.loansService.returnBook(+id);
  }

  @Get()
  findAll() {
    return this.loansService.findAll();
  }

  @Get('overdue')
  async findOverdue() {
    return await this.loansService.findOverdue();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loansService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return this.loansService.update(+id, updateLoanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loansService.remove(+id);
  }
}
