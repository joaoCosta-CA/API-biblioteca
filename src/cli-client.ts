import axios from 'axios';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });
const API_URL = 'http://localhost:3000';

async function mainMenu() {
    console.log('\n====================================');
    console.log('      SISTEMA DA BIBLIOTECA       ');
    console.log('====================================');
    console.log('1. Listar Livros');
    console.log('2. Cadastrar Membro');
    console.log('3. Realizar Empréstimo');
    console.log('4. DEVOLVER LIVRO');
    console.log('5. Listar Empréstimos Ativos');
    console.log('6. Listar ATRASADOS')
    console.log('7. Sair');
    console.log('------------------------------------');

    const choice = await rl.question('Escolha uma opção: ');

    try {
        switch (choice) {
            case '1':
                const books = await axios.get(`${API_URL}/books`);
                console.log('\n--- ACERVO DE LIVROS ---');
                console.table(books.data);
                break;

            case '2':
                const name = await rl.question('Nome: ');
                const email = await rl.question('Email: ');
                const reg = await rl.question('Matrícula: ');
                await axios.post(`${API_URL}/members`, { name, email, registrationNumber: reg });
                console.log('\n✅ Membro cadastrado com sucesso!');
                break;

            case '3':
                const bId = await rl.question('ID do Livro: ');
                const mId = await rl.question('ID do Membro: ');
                await axios.post(`${API_URL}/loans`, { bookId: +bId, memberId: +mId });
                console.log('\n🚀 Empréstimo registrado! O estoque foi atualizado.');
                break;

            case '4':
                const loanId = await rl.question('ID do Empréstimo para devolver: ');
                // Chamada PATCH para a rota que criamos no NestJS
                const response = await axios.patch(`${API_URL}/loans/${loanId}/return`);
                console.log(`\n✅ ${response.data.message}`);
                console.log(`Livro devolvido: ${response.data.bookTitle}`);
                break;

            case '5':
                const loans = await axios.get(`${API_URL}/loans`);
                console.log('\n--- HISTÓRICO DE EMPRÉSTIMOS ---');
                // Filtra para mostrar apenas os que ainda não foram devolvidos
                const activeOnes = loans.data.filter((l: any) => l.status === 'active');
                console.table(activeOnes);
                break;

            case '6':
                try {
                    const response = await axios.get(`${API_URL}/loans/overdue`);
                    console.log('\n⚠️  RELATÓRIO DE EMPRÉSTIMOS EM ATRASO ⚠️');

                    if (response.data.length === 0) {
                        console.log('Parabéns! Não existem livros atrasados no momento.');
                    } else {
                        console.table(response.data.map((l: any) => ({
                            ID: l.id,
                            MembroID: l.memberId,
                            LivroID: l.bookId,
                            Vencimento: new Date(l.dueDate).toLocaleDateString('pt-PT')
                        })));
                    }
                } catch (e: any) {
                    console.error('❌ Erro ao gerar relatório:', e.response?.data?.message || e.message);
                }
                break;


            case '7':
                console.log('Até logo!');
                process.exit();
                break;

            default:
                console.log('Opção inválida.');
        }
    } catch (error: any) {
        console.error('\n❌ ERRO:', error.response?.data?.message || 'Servidor offline ou erro na requisição.');
    }

    mainMenu();
}

mainMenu();