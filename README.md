<h1 align="center">
💻✨ Trilha Digital ✨💻
</h1>
<p align="center">
Sistema de Acompanhamento da Jornada de Meninas no Projeto de Extensão Meninas Digitais UTFPR-CP.
</p>

##  📚 Objetivo do projeto

O **Meninas Digitais UTFPR-CP** é um projeto de extensão que incentiva estudantes do ensino fundamental e médio de Cornélio Procópio a seguirem carreiras em STEM. O **Trilha Digital** vem para centralizar o cadastro de atividades (oficinas, minicursos, mentorias) e acompanhar a jornada individual de cada participante, com pareamento automático de mentoras, gamificação, geração de certificados e dashboard de indicadores de impacto.


## Equipe — Grupo 7
<p>
  
**👥Integrantes:**
  
</p>

- **Bruna Aika Kiyono** RA: 2052482 
- **Gabriel de Souza Muniz** RA: 2475430
- **Luan Tarumoto de Macedo** RA: 2268388
- **Thiago Henrique Rodrigues Arakaki** RA: 2261286 

## 💻Tecnologias

- **Front-end:** React
- **Back-end:** Node.js + Express
- **Banco de dados:** PostgreSQL
- Controle de versão:** Git / GitHub

## Funções desenvolvidas até o momento
- tela inicial; cadastro de alunas; login (perfis de
mentora, aluna e coordenação); botão Sair.
- **Aluna:** ver conquistas (ilustrativas); gerar certificado (preenchimento livre;
futuramente restrito a oficinas concluídas); resumo da trilha (ilustrativo); atividades
com futuras oficinas (inscrições ilustrativas, inativas); mentorias ainda vazio;
dashboard com maioria dos botões inativa, apenas redirecionamentos laterais
funcionam.
- **Coordenação:** cadastro de mentora; edição de mentora (ativo, nome, e-mail);
consulta de mentoras cadastradas.
- **Mentora:** tela indisponível, login funciona, mas sem conteúdo.


## 📁Estrutura do projeto
```
CERTIFICADORA-3/
├── .gitignore
├── backend/
│   ├── .env.example
│   ├── package-lock.json
│   ├── package.json
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   │   └── .gitkeep
│   │   ├── controllers/
│   │   │   └── .gitkeep
│   │   ├── middlewares/
│   │   │   └── .gitkeep
│   │   ├── models/
│   │   │   └── .gitkeep
│   │   ├── routes/
│   │   │   └── .gitkeep
│   │   └── services/
│   │       └── .gitkeep
│   └── tests/
│       └── .gitkeep
├── frontend/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── README.md
│   ├── src/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── icons/
│   │   │   │   ├── 01_inicio.png
│   │   │   │   ├── 02_minha_trilha.png
│   │   │   │   ├── 03_atividades.png
│   │   │   │   ├── 03_data_horario.png
│   │   │   │   ├── 03_mentoria.png
│   │   │   │   ├── 04_mentorias.png
│   │   │   │   ├── 05_conquistas.png
│   │   │   │   ├── 06_adicionar.png
│   │   │   │   ├── 06_certificados.png
│   │   │   │   ├── 08_notificacoes.png
│   │   │   │   ├── 09_perfil_menu.png
│   │   │   │   ├── 22_concluido.png
│   │   │   │   ├── 23_primeiros_passos.png
│   │   │   │   ├── 24_tech_explorer.png
│   │   │   │   ├── 25_future_ai.png
│   │   │   │   ├── 26_mentoria_em_acao.png
│   │   │   │   ├── 27_criadora.png
│   │   │   │   ├── 28_menina_digital.png
│   │   │   │   ├── 29_tecnologia.png
│   │   │   │   ├── 30_ia.png
│   │   │   │   ├── 31_design.png
│   │   │   │   ├── 34_calendario.png
│   │   │   │   ├── 35_localizacao.png
│   │   │   │   ├── 48_foguete_papel.png
│   │   │   │   ├── 54_notebook.png
│   │   │   │   ├── IA.jpg
│   │   │   │   ├── ideia.jpg
│   │   │   │   └── notebook.jpg
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components/
│   │   │   ├── AchievementsSection.jsx
│   │   │   ├── FeaturedActivities.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── HighlightCard.jsx
│   │   │   ├── JoinCard.jsx
│   │   │   ├── JourneyCard.jsx
│   │   │   ├── NextActivityCard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TrailTimeline.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── vite.config.js
└── README.md
```

## Ferramentas necessarias para rodar o projeto

**Node JS (Instalação padrão) [**Download**](https://nodejs.org/en/download/).**

**PostgreSQL (Instalação padrão) [**Download**](https://www.postgresql.org/download/).**

**Visual Studio Code (Instalação padrão) [**Download**](https://code.visualstudio.com/).**

**Navegador WEB**

## 🔌Como rodar o projeto

Uma vez que todas as ferramentas para execução foram baixadas, basta seguir os seguintes passos no terminal do VScode:

### Back-end
```bash
cd backend
npm install
cp .env.example .env
# Edite DB_PASSWORD em .env com a senha do PostgreSQL
npm run db:setup
node src/app.js
```

O comando `npm run db:setup` cria o banco definido em `DB_NAME` (por padrão,
`trilha_digital`) e as tabelas necessárias para cadastro e autenticação.
Para criar as contas de teste depois do setup, execute `node seed-contas-teste.js`.

### Front-end
```bash
cd frontend
npm install
npm run dev
```

### Login e senha de perfis de teste
Coordenação:
```bash
login: coordenacao@teste.com
Senha: 123456
```
Mentora:
```bash
login: mentora@teste.com
Senha: 123456
```
Aluna:
```bash
login: bruna@teste.com
Senha: 123456
```

## Roteiro de teste
Após executar o sistema conforme o README do repositório, há diferentes rotas. A
recomendada: cadastrar uma aluna (o login é automático), explorar as funções e sair
pelo canto superior direito. Em seguida, entrar como mentora ou coordenação com
as credenciais fornecidas. No perfil de coordenação, é possível cadastrar mentoras
e depois logar como uma delas. O teste é intuitivo e pode ser feito na ordem
preferida.
4.Objetivo do sistema
O objetivo do Trilha Digital é ser uma plataforma web que centraliza o cadastro de
atividades e acompanha a jornada individual de cada aluna, registrando participação
em oficinas, minicursos e mentorias, sugerindo pareamento entre mentoras e
alunas, recomendando próximas atividades e gerando indicadores de impacto.
Como diferencial, inclui gamificação leve (emblemas e pontuação) e certificados em
PDF

## Documentação

O documento de Projeto Inicial está disponível em [**Projeto Inicial**](https://drive.google.com/file/d/1bqT2eTBG5ulltN4QFeJAyWxvGyYSDtY3/view?usp=sharing).

## Status

Em desenvolvimento — Certificadora 3, UTFPR-CP, 2026.
