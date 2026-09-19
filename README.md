# Sistema de Gestão de Compras (Procurement) com IA

Aplicação full-stack desenvolvida com **NestJS**, **Next.js**, **PostgreSQL** e **Prisma ORM**, contando com autenticação via JWT, modelagem relacional, proteção de rotas e triagem automatizada de solicitações de compra com **OpenAI** (`gpt-4o-mini`)[cite: 2].

---

## 🛠️ Tecnologias Utilizadas

### Backend
* **NestJS** + **TypeScript**[cite: 2]
* **PostgreSQL**[cite: 2]
* **Prisma ORM**
* **Passport JWT** + **Bcrypt**[cite: 2]
* **Class-Validator**
* **OpenAI API** (`gpt-4o-mini`)[cite: 2]
* **Docker Compose**[cite: 2]

### Frontend
* **Next.js (App Router)** + **TypeScript**[cite: 2]
* **Tailwind CSS**
* **js-cookie**
* **Lucide Icons**

---

## 🚀 Como Rodar o Projeto Localmente

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
> Preencha `JWT_SECRET` com uma chave segura e configure sua chave da OpenAI em `OPENAI_API_KEY`[cite: 2].

3. Suba o container do banco de dados PostgreSQL com Docker Compose:
```bash
docker compose up -d
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie a API NestJS:
```bash
npm run start:dev
```
*A API estará acessível em `http://localhost:3000`.*

---

### 3. Configurar e Rodar o Frontend (Next.js)

1. Em um novo terminal, acesse a pasta `frontend` e instale as dependências:
```bash
cd frontend
npm install
```

2. Configure o arquivo de variáveis de ambiente:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
```
> *Nota para GitHub Codespaces:* Caso utilize o Codespaces, altere a visibilidade da porta 3000 para **Public** e informe a URL pública gerada no `NEXT_PUBLIC_API_URL`[cite: 9].

3. Inicie o servidor de desenvolvimento do Next.js:
```bash
npm run dev
```
*O frontend estará disponível em `http://localhost:3001` (ou `http://localhost:3000`).*

---

## 📌 Endpoints da API REST

### Autenticação (Públicos)
* `POST /auth/register` — Cria um usuário (senha armazenada com hash bcrypt)[cite: 2].
* `POST /auth/login` — Valida as credenciais e retorna um token JWT[cite: 2].

### Fornecedores (Protegidos por Bearer Token)
* `POST /suppliers` — Cria um fornecedor (com validação de formato de e-mail)[cite: 2].
* `GET /suppliers` — Lista todos os fornecedores[cite: 2].

### Solicitações de Compra (Protegidos por Bearer Token)
* `POST /purchase-requests` — Cria uma solicitação de compra (validações: `item_name`, `quantity > 0` e `requester_name` obrigatórios; `supplier_id` opcional)[cite: 2].
* `GET /purchase-requests` — Lista solicitações de compra, com suporte a filtro por status: `GET /purchase-requests?status=pendente`[cite: 2].
* `GET /purchase-requests/:id` — Detalhe da solicitação, incluindo dados do fornecedor e parecer de IA (se existir)[cite: 2].
* `POST /purchase-requests/:id/review` — Envia os dados (item, quantidade, justificativa) para o modelo `gpt-4o-mini`, classifica prioridade (`alta`, `media`, `baixa`), gera resumo explicativo de até 2 frases, persiste em `ai_reviews` e retorna o parecer[cite: 2].
* `PATCH /purchase-requests/:id/status` — Atualiza o status da solicitação (`pendente`, `aprovado`, `rejeitado`)[cite: 2].

---

## 💻 Funcionalidades do Frontend

* **Autenticação:** Tela de login e registro com armazenamento do token JWT e proteção de rotas privadas[cite: 2].
* **Listagem com Filtros:** Tabela com listagem de solicitações e filtro dinâmico por status (`pendente`, `aprovado`, `rejeitado`)[cite: 2].
* **Indicador Visual de Prioridade:** Badges estilizados indicando a prioridade gerada pela IA (`alta`, `media`, `baixa`)[cite: 2].
* **Modal de Detalhes:** Apresenta dados da solicitação, fornecedor vinculado e parecer de IA[cite: 2].
* **Ação de IA em Tempo Real:** Botão para gerar o parecer com IA e exibir o resultado sem recarregar a página[cite: 2].
* **Alteração de Status:** Atualização do status da compra diretamente no modal de detalhes[cite: 2].
* **Cadastros:** Formulários modais para cadastro de novo fornecedor e criação de nova solicitação de compra[cite: 2].