# 🧢 AlugaAi — Sistema de Aluguel de Itens

Projeto completo de uma plataforma de aluguel de produtos, onde os usuários podem alugar itens com facilidade.

## 📦 Funcionalidades

- 📋 Cadastro e listagem de itens para aluguel.
- 🛒 Processo de aluguel com datas e controle de disponibilidade.
- 💳 Pagamento integrado com Mercado Pago. (Em desenvolvimento)
- 📦 Devolução de itens com atualização automática de disponibilidade.
- 🔐 Autenticação com e-mail e senha.
- 📁 Área de pedidos do usuário com status atualizado.
- ☁️ Deploy completo na [Render](https://render.com/).

## 🚀 Tecnologias Utilizadas

- **Next.js App Router (13+)**
- **Prisma ORM + PostgreSQL**
- **Tailwind CSS**
- **TypeScript**
- **API REST (via App Router)**
- **Mercado Pago SDK**
- **Render.com (deploy)**

## 🛠️ Instalação e Configuração Local

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/nome-do-repo.git
cd nome-do-repo
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

Crie um banco PostgreSQL local.
Depois, crie um arquivo `.env` na raiz com:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/localhost"
```

### 4. Rode as migrations do Prisma

```bash
npx prisma migrate dev
```

### 5. Inicie o servidor local

```bash
npm run dev
```

O app estará disponível em: [http://localhost:3000](http://localhost:3000)

## 💡 Principais Fluxos

### ✅ Aluguel

- O usuário seleciona um item disponível.
- Define uma data de início e tempo de aluguel.
- Após confirmar, um pedido é criado e redirecionado para o Mercado Pago.
- Após o pagamento, o sistema atualiza automaticamente a disponibilidade.

### 🔁 Devolução

- O usuário clica em "Devolver" em um item alugado.
- Após confirmação e pagamento (se aplicável), o item volta a ficar disponível.

### 🧾 Pedidos

- O usuário pode acessar "Meus Pedidos" e visualizar todos os aluguéis.
- Status, datas e botões de ação (como devolução) são atualizados em tempo real.

## 🧪 API Endpoints

A API está implementada com o App Router. Exemplos de endpoints:

- `GET /api/items` — Lista todos os itens
- `POST /api/orders` — Cria um novo pedido
- `PUT /api/items/:id` — Atualiza disponibilidade
- `POST /api/payments` — Cria um registro de pagamento

## ☁️ Deploy

O projeto está em deploy no Render.

- [Aluga Ai](https://alugaai-wrd4.onrender.com/)


## 📚 Referências

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Prisma ORM Docs](https://www.prisma.io/docs)
- [Mercado Pago Docs](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/introduction)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 👨‍💻 Desenvolvedor

Feito por:

 **Luis Fernando**  
📧 luis.fernando.dev029@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/luis-fernando-821967216)


 **Caue Caramello**  
📧 luis.fernando.dev029@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/luis-fernando-821967216)


 **Paulo Cesar da Cruz**  
📧 luis.fernando.dev029@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/luis-fernando-821967216)
