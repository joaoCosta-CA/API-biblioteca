# 📚 Biblioteca API + CLI

> **Este projeto é um sistema completo de gestão de biblioteca desenvolvido com NestJS, Drizzle ORM e PostgreSQL. Ele inclui uma API REST robusta e uma interface de linha de comando (CLI) para interação simplificada.**
>
## 🚀 Funcionalidades
### 📖 Gestão de Livros

 - CRUD completo de livros.

 - Controle automático de estoque (totalCopies vs availableCopies).

 - Validação para impedir estoque negativo.

### 👥 Gestão de Membros

 - Cadastro de membros com identificação única (registrationNumber).

 - Validação de e-mail e restrição de duplicidade.

### 📑 Sistema de Empréstimos (Regras de Negócio)

 - Empréstimo Dinâmico: Diminui o estoque do livro ao realizar um empréstimo.

 - Devolução Inteligente: Restaura o estoque e calcula a data de entrega.

 - Limite de Uso: Membros não podem ter mais de 3 empréstimos ativos simultâneos.

 - Bloqueio de Devedores: Impede novos empréstimos caso o membro possua livros atrasados.

 - Relatório de Atrasos: Listagem em tempo real de empréstimos com data de vencimento ultrapassada.

## 🛠️ Tecnologias Utilizadas

 - Framework: NestJS

 - ORM: Drizzle ORM

 - Banco de Dados: PostgreSQL (via Docker)

 - Linguagem: TypeScript

 - Interface: Axios + Readline (CLI Client)

## 📦 Como Executar o Projeto
1. Pré-requisitos

   - Docker e Docker Compose instalados.

   - Node.js (v18 ou superior).
  
  2. Configuração do Banco de Dados

     - No terminal, suba o container do PostgreSQL:
        ```bash
          docker-compose up -d
        ```
  3. Instalação e Migrações

     - Instale as dependências e sincronize o schema com o banco:
       ```bash
         npm install
         npx drizzle-kit push
       ```
  4. Rodar a API

     - Inicie o servidor em modo desenvolvimento:
        ```bash
            npm run start:dev
        ```
        #### A API estará disponível em http://localhost:3000

  ## 🛣️ Principais Rotas da API
  | Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | /books | Lista todos os livros |
| `POST` | /members | Cadastra um novo membro |
| `POST` | /loans | Realiza um emprestimo(valida estoque e atrasos) |
| `PATCH` | /loans/:id/return | Realiza a devolução de um livro |
| `GET` | /loans/overdue | Relatório de livros atrasados |


## 👨‍💻 Autor

### João Henrique (JoaoHB)
Projeto desenvolvido como parte do treinamento de Backend com foco em Arquitetura de Software e Banco de Dados Relacional.
