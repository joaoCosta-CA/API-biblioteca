import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateMemberDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    @IsEmail({}, { message: 'O e-mail informado é inválido' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    registrationNumber: string;
}
