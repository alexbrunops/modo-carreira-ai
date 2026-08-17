cat > README.md << 'EOF'
# ⚽ Agente de Imersão - Modo Carreira

Sistema para criar narrativas imersivas em jogos de futebol usando IA.

## 🎯 Objetivo

Criar um agente que, utilizando dados reais e dados dos jogos, gere personagens do mundo do futebol (imprensa, podcasts, torcedores, diretores, auxiliares) e narrativas realísticas para uma maior imersão.

## 🛠️ Stack

- **Frontend**: React 17 + Vite 2 + Tailwind CSS 2
- **Backend**: Node.js 16 + Express 4
- **Banco**: SQLite
- **Estado**: Zustand
- **Validação**: Zod

## 📋 Pré-requisitos

- macOS High Sierra 10.13.6 ou superior
- Node.js 16.x
- npm 8.x

## 🚀 Como rodar

### Backend
```bash
cd apps/api
npm install
npm run dev
# http://localhost:3001