# Sistema de Solicitações de Compras com IA

API REST desenvolvida em **NestJS**, **PostgreSQL** e **Prisma ORM**, com autenticação via JWT, validação rigorosa de dados e triagem automatizada de pedidos utilizando a API da **OpenAI**.

---

## 🛠️ Tecnologias Utilizadas
* **NestJS** + **TypeScript**
* **PostgreSQL**
* **Prisma ORM**
* **Passport JWT** + **Bcrypt**
* **OpenAI API** (`gpt-3.5-turbo`)
* **Docker Compose**

---

## 🚀 Como Rodar o Projeto

### 1. Clonar e Instalar Dependências
```bash
git clone <url-do-repositorio>
cd <pasta-do-projeto>
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo de exemplo e preencha suas variáveis:
```bash
cp .env.example .env
```
> Adicione uma chave válida da OpenAI na variável `OPENAI_API_KEY`.

### 3. Subir o Banco de Dados (Docker)
```bash
docker compose up -d
```

### 4. Executar Migrações do Banco
```bash
npx prisma migrate dev
```

### 5. Iniciar a Aplicação
```bash
npm run start:dev
```
A API estará acessível em `http://localhost:3000`.

---

## 📌 Endpoints Principais

### Autenticação (Públicos)
* `POST /auth/register` — Cadastro de usuário.
* `POST /auth/login` — Autenticação e obtenção do Bearer Token.

### Fornecedores (Protegidos por Bearer Token)
* `POST /suppliers` — Cadastra um novo fornecedor.
* `GET /suppliers` — Lista todos os fornecedores.
* `GET /suppliers/:id` — Detalhes de um fornecedor.
* `PATCH /suppliers/:id` — Atualiza dados do fornecedor.
* `DELETE /suppliers/:id` — Remove fornecedor.

### Solicitações de Compra (Protegidos por Bearer Token)
* `POST /purchase-requests` — Cria solicitação (validações: `quantity > 0`, campos obrigatórios).
* `GET /purchase-requests` — Lista solicitações com dados de fornecedor e pareceres de IA.
* `GET /purchase-requests/:id` — Consulta solicitação por ID.
* `PATCH /purchase-requests/:id` — Atualiza status ou dados da solicitação.
* `DELETE /purchase-requests/:id` — Remove solicitação.

### Análise de IA (Protegido por Bearer Token)
* `POST /ai/analyze/:purchaseRequestId` — Envia a justificativa do pedido para a OpenAI classificar a prioridade (`alta`, `media`, `baixa`) e gerar um parecer salvo no banco.