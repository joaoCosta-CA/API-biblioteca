import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateLoanDto {
    @IsInt()
    @IsNotEmpty()
    bookId: number;

    @IsInt()
    @IsNotEmpty()
    memberId: number;
}
