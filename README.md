<h1 align="center">
💻✨ Trilha Digital ✨💻
</h1>
<p align="center">
Sistema de Acompanhamento da Jornada de Meninas no Projeto de Extensão Meninas Digitais UTFPR-CP.
</p>

## 📚 Objetivo do projeto

O **Meninas Digitais UTFPR-CP** é um projeto de extensão que incentiva estudantes do ensino fundamental e médio de Cornélio Procópio a seguirem carreiras em STEM. O **Trilha Digital** é uma plataforma web que centraliza o cadastro de atividades (oficinas, minicursos, mentorias) e acompanha a jornada individual de cada participante: inscrições, presenças, encontros de mentoria, pareamento automático com mentoras, gamificação leve (pontos e emblemas), certificados em PDF e um painel de indicadores de impacto para a coordenação.

## Equipe — Grupo 7

**👥 Integrantes:**

- **Bruna Aika Kiyono** RA: 2052482
- **Gabriel de Souza Muniz** RA: 2475430
- **Luan Tarumoto de Macedo** RA: 2268388
- **Thiago Henrique Rodrigues Arakaki** RA: 2261286

## 💻 Tecnologias

- **Front-end:** React 19 + Vite + Tailwind CSS + React Router
- **Back-end:** Node.js + Express 5
- **Banco de dados:** PostgreSQL
- **PDF:** PDFKit
- **Testes:** executor nativo do Node (`node:test`)
- **Controle de versão:** Git / GitHub

## ✅ Funcionalidades

### Aluna (menina)
- Cadastro público e login; ao se cadastrar, é **pareada automaticamente** com uma mentora.
- **Início:** progresso da jornada, próxima atividade, conquistas, trilha e atividades recomendadas.
- **Atividades:** lista com abas (próximas, minhas inscrições, já realizadas) e filtro por categoria; inscrição e cancelamento com controle de vagas; página de detalhes de cada atividade.
- **Minha trilha:** etapas (cadastro → primeira oficina → IA → mentoria → projeto próprio), com dicas e pontuação.
- **Conquistas:** 6 emblemas, liberados automaticamente.
- **Mentorias:** mentora atribuída e histórico de encontros.
- **Certificados:** PDF gerado apenas para atividades com presença confirmada.
- Notificações (lembrete da próxima atividade e conquistas recentes) e menu adaptado para celular.

### Mentora
- **Mentorandas:** lista com progresso de cada uma; registro de encontros (data, resumo e avaliação de 1 a 5) e histórico.
- **Presença:** marcar/desmarcar presença das inscritas em **qualquer** atividade (não só nas que é responsável). Fica gravado quem fez cada registro.
- **Minhas atividades:** cadastrar, editar e excluir as atividades pelas quais é responsável.

### Coordenação
- **Indicadores:** meninas, mentoras ativas, atividades, taxa de presença, inscrições, presenças, encontros, emblemas e números por categoria.
- **Atividades** e **Presença:** gestão de todas as atividades, escolhendo a mentora responsável.
- **Mentoras:** cadastrar, editar, redefinir senha, ativar/desativar (as mentorandas de uma mentora desativada são redistribuídas).
- **Alunas:** lista com busca, mentora, atividades concluídas, emblemas e pontos; botão para parear alunas sem mentora.

### Sessão
- Quem já está logado e abre `/login` ou `/cadastro` é levado ao próprio painel.
- A sessão é conferida com o servidor ao abrir o site e sempre que a aba volta a ficar em foco. Se a conta foi **desativada** ou não existe mais, o usuário é desconectado e a tela de login explica o motivo. Se o servidor estiver fora do ar, a sessão é mantida.
- Mudanças feitas pela coordenação (por exemplo, o nome da mentora) aparecem sem precisar entrar de novo.

## 🎮 Regras do sistema

**Quem registra o quê:** a presença em oficinas pode ser registrada por **qualquer mentora ativa ou pela coordenação**, e o sistema grava quem fez a última alteração e quando. Já os **encontros de mentoria** só podem ser registrados pela mentora da própria aluna.

**Pontos:** cada presença em atividade vale **50 pontos**; cada encontro de mentoria, **30 pontos**. Desmarcar uma presença devolve os pontos. A coordenação pode ajustar pontos manualmente pela API.

**Emblemas** (concedidos automaticamente):

| Emblema | Como conquistar |
|---|---|
| Primeiros Passos | 1ª atividade concluída |
| Tech Explorer | 3 atividades de tecnologia |
| Future AI | 1 atividade de IA & Dados |
| Mentoria em Ação | 1º encontro com a mentora |
| Criadora | 5 atividades concluídas |
| Menina Digital | todos os emblemas anteriores |

**Pareamento por carga:** cada nova aluna é ligada à mentora **ativa** com menos mentorandas (empate: a mentora cadastrada há mais tempo). Ao cadastrar ou reativar uma mentora, as alunas sem mentora são pareadas; ao desativar uma mentora, suas mentorandas são redistribuídas entre as ativas.

**Recomendações:** atividades futuras, com vaga e em que a aluna ainda não se inscreveu, priorizando categorias que ela ainda não experimentou.

## 🛠️ Ferramentas necessárias

- **Node.js 22 ou superior** — [Download](https://nodejs.org/en/download/)
- **PostgreSQL** — [Download](https://www.postgresql.org/download/)
- **Visual Studio Code** (recomendado) — [Download](https://code.visualstudio.com/)
- Um navegador web

## 🔌 Como rodar o projeto

Abra dois terminais no VS Code, um para o back-end e outro para o front-end.

### 1. Clonar o repositorio
```bash
git clone https://github.com/arakakithiago/CERTIFICADORA-3
cd CERTIFICADORA-3

```
### 1. Back-end
```bash
cd backend
npm install
cp .env.example .env      # no Windows (PowerShell): copy .env.example .env
# Edite DB_PASSWORD no .env com a senha do seu PostgreSQL
npm run db:setup          # cria o banco e as tabelas
npm run db:seed           # cria as contas e atividades de teste
npm start                 # API em http://localhost:3001
```

- `npm run db:setup` cria o banco definido em `DB_NAME` (padrão `trilha_digital`) e todas as tabelas. Pode ser executado de novo com segurança: não apaga dados.
- `npm run db:seed` cria as contas de teste e 4 atividades de exemplo. Também pode ser executado várias vezes sem duplicar nada.

> ⚠️ **Depois de atualizar o código (git pull), reinicie o back-end** (Ctrl+C e `npm start`) e rode `npm run db:setup`. Se o front-end mostrar *"O servidor do backend parece desatualizado"*, é porque um servidor antigo continua rodando.

### 2. Front-end
```bash
cd frontend
npm install
npm run dev               # abre em http://localhost:5173
```

Para usar outro endereço de API, copie `frontend/.env.example` para `frontend/.env.local` e ajuste `VITE_API_URL`.

### Contas de teste

Todas com a senha **123456**:

| Perfil | E-mail | O que já vem pronto |
|---|---|---|
| Coordenação | `coordenacao@teste.com` | — |
| Mentora | `mentora@teste.com` | responsável pelas 4 atividades de exemplo |
| Aluna | `bruna@teste.com` | pareada com a mentora, 1 atividade concluída (com certificado e emblema) e 1 inscrição futura |

## 🧭 Roteiro de teste sugerido

1. **Aluna:** entre como `bruna@teste.com`. Veja o início, inscreva-se em uma atividade em *Atividades*, baixe o certificado em *Certificados* e confira os emblemas em *Conquistas*.
2. **Nova aluna:** saia (menu no canto superior direito) e cadastre uma nova conta. Ela é pareada automaticamente com uma mentora (veja em *Mentorias*).
3. **Mentora:** entre como `mentora@teste.com`. Em *Mentorandas*, registre um encontro com a Bruna; em *Presença*, marque a presença de uma aluna. Ao voltar como aluna, os pontos e emblemas novos aparecem.
4. **Coordenação:** entre como `coordenacao@teste.com`. Veja os *Indicadores*, cadastre uma atividade, cadastre uma mentora e acompanhe as alunas em *Alunas*.

## 🧪 Testes automatizados

```bash
cd backend
npm test
```

São 43 testes de ponta a ponta da API (cadastro, login, sessão e senha, pareamento, oficinas e vagas, presença, encontros, pontos, emblemas, trilha, recomendações, certificados e indicadores).

Os testes usam um **banco separado**, `trilha_digital_teste` (configurável por `DB_NAME_TESTE`), que é criado automaticamente e **esvaziado a cada execução**. O banco de desenvolvimento nunca é alterado. O PostgreSQL precisa estar rodando.

No front-end, `npm run lint` verifica o código e `npm run build` gera a versão de produção.

## 🔗 Rotas da API

Todas começam com `/api`.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/registro` | Cadastro de aluna (com pareamento automático) |
| POST | `/login` | Login (contas inativas são bloqueadas) |
| GET | `/sessao/:id` | Confere se a conta ainda existe e está ativa (403/404 = encerrar sessão) |
| GET / POST | `/mentoras` | Listar (com nº de mentorandas) / cadastrar mentora |
| PUT | `/mentoras/:id` | Editar nome e e-mail |
| PATCH | `/mentoras/:id/status` | Ativar/desativar (redistribui mentorandas) |
| PATCH | `/mentoras/:id/senha` | Redefinir senha da mentora (coordenação) |
| GET | `/mentoras/:id/mentorandas` | Mentorandas e progresso |
| GET / POST | `/oficinas` | Listar (`?futuras=true`, `?menina_id=`) / cadastrar |
| GET / PUT / DELETE | `/oficinas/:id` | Detalhes / editar / excluir |
| GET | `/oficinas/:id/inscricoes` | Inscritas, presença e quem a registrou |
| POST / DELETE | `/oficinas/inscricao` | Inscrever / cancelar inscrição |
| PATCH | `/oficinas/presenca` | Marcar ou desmarcar presença (pontos e emblemas); exige `registrado_por` = mentora ativa ou coordenação |
| GET / POST | `/mentorias/encontros` | Listar (`?mentora_id=`, `?menina_id=`) / registrar encontro |
| GET | `/meninas` | Lista de alunas (coordenação) |
| GET | `/meninas/:id/trilha` | Resumo da jornada |
| GET | `/meninas/:id/recomendacoes` | Atividades recomendadas |
| GET | `/meninas/:id/conquistas` | Emblemas (conquistados ou não) |
| GET | `/meninas/:id/atividades-concluidas` | Atividades que geram certificado |
| POST | `/certificados/gerar` | PDF do certificado (`menina_id`, `oficina_id`) |
| POST | `/trilha/pontuar` | Ajuste manual de pontos |
| POST | `/pareamento/executar` | Parear alunas sem mentora |
| GET | `/dashboard` | Indicadores de impacto |

## 📁 Estrutura do projeto
```
CERTIFICADORA-3/
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── setup-db.js              # cria banco e tabelas (npm run db:setup)
│   ├── seed-contas-teste.js     # dados de teste (npm run db:seed)
│   ├── src/
│   │   ├── app.js               # servidor Express e registro das rotas
│   │   ├── config/              # conexão com o banco e transações
│   │   ├── controllers/         # regras de cada recurso (auth, mentoras, oficinas, ...)
│   │   ├── routes/              # definição das rotas da API
│   │   └── services/            # gamificação (pontos/emblemas) e pareamento
│   └── tests/                   # testes automatizados (npm test)
├── frontend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── App.jsx              # rotas e proteção por perfil
│       ├── main.jsx
│       ├── assets/              # imagens e ícones
│       ├── components/          # componentes da aluna (cards, menu, cabeçalho, ...)
│       │   └── painel/          # componentes dos painéis da mentora e da coordenação
│       ├── context/             # usuário logado (AuthContext)
│       ├── hooks/               # carregamento de dados (useCarregar)
│       ├── pages/               # telas
│       ├── services/api.js      # chamadas à API
│       └── utils/               # categorias e formatação de datas
└── README.md
```

## ⚠️ Limitações conhecidas

- **A API não usa token de autenticação.** O login devolve os dados do usuário e o front-end controla o acesso às telas por perfil, mas as rotas da API em si são abertas. Para uso em produção, o próximo passo seria autenticação com token (por exemplo, JWT) e verificação de perfil em cada rota.
- A coordenação pode redefinir a senha das mentoras, mas não há recuperação de senha por e-mail nem troca da própria senha pela interface.
- Alunas não podem ser desativadas pela interface (apenas mentoras).
- Alunas já pareadas não são rebalanceadas quando entra uma mentora nova; só as alunas sem mentora são distribuídas.

## Documentação

O documento de Projeto Inicial está disponível em [**Projeto Inicial**](https://drive.google.com/file/d/1bqT2eTBG5ulltN4QFeJAyWxvGyYSDtY3/view?usp=sharing).

## Status

Em desenvolvimento — Certificadora 3, UTFPR-CP, 2026.
