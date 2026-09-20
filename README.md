# Sistema de Gestão de Compras (Procurement) com IA

Aplicação full-stack desenvolvida com NestJS, Next.js, PostgreSQL e Prisma ORM, contando com autenticação via JWT, modelagem relacional, proteção de rotas e triagem automatizada de solicitações de compra com OpenAI (gpt-4o-mini).

---

## Tecnologias Utilizadas

### Backend
* NestJS + TypeScript
* PostgreSQL
* Prisma ORM
* Passport JWT + Bcrypt
* Class-Validator
* OpenAI API (gpt-4o-mini)
* Docker Compose

### Frontend
* Next.js (App Router) + TypeScript
* Tailwind CSS
* js-cookie
* Lucide Icons

---

## Como Rodar o Projeto Localmente

### 1. Clonar o Repositório
```bash
git clone [https://github.com/brunopet8/Api-neofuturo.git](https://github.com/brunopet8/Api-neofuturo.git)
cd Api-neofuturo
```

### 2. Configurar o Backend

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente a partir do exemplo:
```bash
cp .env.example .env
```
> Preencha JWT_SECRET com uma chave segura e configure a sua chave da OpenAI em OPENAI_API_KEY.

3. Suba o contentor da base de dados PostgreSQL com Docker Compose:
```bash
docker compose up -d
```

4. Execute as migrações da base de dados:
```bash
npx prisma migrate dev
```

5. Inicie a API NestJS:
```bash
npm run start:dev
```
A API estará acessível em http://localhost:3000.

---

### 3. Configurar e Rodar o Frontend (Next.js)

1. Num novo terminal, aceda à pasta frontend e instale as dependências:
```bash
cd frontend
npm install
```

2. Configure o ficheiro de variáveis de ambiente:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
```
> Nota para GitHub Codespaces: Caso utilize o Codespaces, altere a visibilidade da porta 3000 para Public e informe o URL público gerado em NEXT_PUBLIC_API_URL.

3. Inicie o servidor de desenvolvimento do Next.js:
```bash
npm run dev
```
O frontend estará disponível em http://localhost:3001 (ou http://localhost:3000).

---

## Endpoints da API REST

### Autenticação (Públicos)
* POST /auth/register — Cria um utilizador (palavra-passe armazenada com hash bcrypt).
* POST /auth/login — Valida as credenciais e retorna um token JWT.

### Fornecedores (Protegidos por Bearer Token)
* POST /suppliers — Regista um fornecedor (com validação de formato de e-mail).
* GET /suppliers — Lista todos os fornecedores.

### Solicitações de Compra (Protegidos por Bearer Token)
* POST /purchase-requests — Cria uma solicitação de compra (validações: item_name, quantity > 0 e requester_name obrigatórios; supplier_id opcional).
* GET /purchase-requests — Lista solicitações de compra, com suporte a filtro por status: GET /purchase-requests?status=pendente.
* GET /purchase-requests/:id — Detalhe da solicitação, incluindo dados do fornecedor e parecer de IA (se existir).
* POST /purchase-requests/:id/review — Envia os dados (item, quantidade, justificativa) para o modelo gpt-4o-mini, classifica a prioridade (alta, media, baixa), gera um resumo explicativo de até 2 frases, persiste em ai_reviews e retorna o parecer.
* PATCH /purchase-requests/:id/status — Atualiza o status da solicitação (pendente, aprovado, rejeitado).
