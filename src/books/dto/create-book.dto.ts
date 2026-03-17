import { IsString, IsInt, IsNotEmpty, Min, MaxLength } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  author: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1000)
  publishedYear: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  totalCopies: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  availableCopies: number;

}
