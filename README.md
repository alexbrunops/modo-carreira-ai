# ⚽ Agente de Imersão - Modo Carreira

Sistema para criar narrativas imersivas em jogos de futebol usando IA.

## 🎯 Objetivo

Criar um agente que, utilizando dados reais e dados dos jogos, gere personagens do mundo do futebol (imprensa, podcasts, torcedores, diretores, auxiliares) e narrativas realísticas para uma maior imersão.

## 🛠️ Stack

- **Frontend** (`apps/web`): React 17 + Vite 2 + Tailwind CSS 2
- **Backend** (`apps/api`): Node.js + Express 4
- **Banco**: SQLite
- **IA**: OpenAI (DeepSeek, Claude e Groq já previstos em `apps/api/src/config/ai.json`)

## 📋 Pré-requisitos

- Node.js 20.17 ou superior (exigido pelo `sqlite3` 6 e pelo `nodemon` 3)
- npm 10 ou superior

## 🚀 Como rodar

### Backend

```bash
cd apps/api
cp .env.example .env   # preencha AUTH_SECRET e a chave do provedor de IA
npm install
npm run dev
# http://localhost:3001
```

### Frontend

```bash
cd apps/web
npm install
npm run dev
# http://localhost:3000
```

Da raiz também dá para usar `npm run dev:api` e `npm run dev:web`.

## 🔐 Contas e login

- As senhas são salvas com hash (scrypt).
- O login devolve um token assinado com `AUTH_SECRET`, válido por 7 dias. O front envia esse token no header `Authorization: Bearer <token>`.
- Rotas que alteram contas e carreiras exigem login e só aceitam o dono do registro.

## 🗄️ Banco de dados

O arquivo do banco fica em `DB_PATH` (padrão `apps/api/dev.db`) e as tabelas são criadas ao subir a API. Se você tem um `dev.db` criado antes desta versão, apague-o para que as tabelas sejam recriadas com o esquema novo.

## 🌐 Principais rotas da API

| Recurso | Rotas |
| --- | --- |
| Contas | `POST /api/accounts/register`, `POST /api/accounts/login`, `GET /api/accounts/profile`, `PUT /api/accounts/:id`, `PUT /api/accounts/:id/change-password`, `DELETE /api/accounts/:id` |
| Carreiras | `POST /api/careers` (cria carreira + treinador + time), `GET /api/careers/:id`, `GET /api/careers/account/:accountId`, `PUT /api/careers/:id`, `DELETE /api/careers/:id` |
| Times, técnicos e jogadores | `GET/POST /api/teams`, `/api/managers`, `/api/players`, mais `GET/PUT/DELETE /:id` e `GET /search/:name`. Listagens aceitam `?career_id=` |
| IA | `GET /api/ai/providers`, `POST /api/ai/generate`, `POST /api/ai/generate-multiple` |
