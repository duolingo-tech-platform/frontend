# Duolingo Tech Platform

Plataforma de aprendizado gamificado inspirada no modelo do Duolingo, desenvolvida para ensinar tecnologia de forma prática, progressiva e interativa.

O foco principal é o ensino de desenvolvimento mobile com **Expo/React Native** e computação em nuvem com **AWS**, utilizando mecânicas de gamificação para aumentar engajamento, retenção e consistência no aprendizado.

---

## Objetivo

Criar uma plataforma moderna de ensino que transforma conteúdos técnicos em experiências rápidas, dinâmicas e motivadoras através de microlições, exercícios interativos, sistema de XP, progressão por níveis, streak diário, feedback imediato e revisão inteligente.

---

## Cursos Disponíveis

### 📱 Expo (React Native)
- Fundamentos
- Componentes
- Navegação
- APIs
- Armazenamento local
- Build e Deploy

### ☁️ AWS Cloud
- Conceitos de Cloud Computing
- IAM
- S3
- EC2
- Lambda
- API Gateway
- DynamoDB

---

## Funcionalidades

### Autenticação
- Cadastro e login
- Recuperação de senha (fluxo de 4 etapas)
- Edição de perfil

### Trilhas de Aprendizado
- Cursos organizados em módulos e lições
- Progressão linear com desbloqueio por pré-requisito
- Mapa de lições estilo path (Duolingo)

### Exercícios Interativos
- Múltipla escolha
- Verdadeiro/Falso
- Associação
- Completar código
- Ordenar passos

### Gamificação
- XP e níveis
- Streak diário
- Conquistas
- Ranking semanal

### Progresso
- Histórico de atividades
- Taxa de acerto
- Evolução por curso e módulo

### Revisão Inteligente
- Identificação de erros recorrentes
- Sugestões automáticas de revisão
- Exercícios adaptativos

### Administração *(roadmap)*
- CRUD de cursos, módulos, lições e exercícios
- Relatórios de uso

---

## Arquitetura

### Frontend (este repositório)
| Tecnologia | Uso |
|---|---|
| Expo / React Native | App mobile iOS e Android |
| Expo Router | Navegação file-based |
| expo-linear-gradient | UI / design system |

### Backend *(roadmap)*
| Tecnologia | Uso |
|---|---|
| C# (.NET) | API REST |

### Infraestrutura *(roadmap)*
| Serviço | Uso |
|---|---|
| AWS Lambda | Funções serverless |
| AWS API Gateway | Endpoints REST |
| AWS DynamoDB | Banco de dados NoSQL |
| AWS S3 | Armazenamento de assets |
| AWS Cognito | Autenticação / JWT |

---

## Estrutura de Telas (Mobile)

```
app/
├── index.tsx           → Redirect para /onboarding
├── onboarding.tsx      → Tela de boas-vindas
├── login.tsx           → Login
├── register.tsx        → Cadastro
├── forgotpassword.tsx  → Recuperação de senha (4 passos)
├── home.tsx            → Dashboard principal
├── courses.tsx         → Lista e busca de cursos
├── lessonview.tsx      → Mapa de lições do curso
├── exercisescreens.tsx → Tela de exercícios
├── resultsummary.tsx   → Resultado da lição
├── profilescreens.tsx  → Perfil, edição, histórico e configurações
└── ranking.tsx         → Ranking semanal de usuários
```

### Fluxo de Navegação

```
Onboarding → Login / Cadastro
                ↓
             Home ←──────────────────────────────┐
              ↓                                   │
     ┌────────┼────────┬──────────┐              │
  Cursos   Ranking  Perfil   Lição (Up Next)     │
     ↓                            ↓              │
 LessonView              Exercícios              │
     ↓                            ↓              │
 Exercícios              ResultSummary ──────────┘
```

---

## Público-Alvo

- Estudantes de ADS e Engenharia
- Iniciantes em desenvolvimento mobile
- Iniciantes em cloud computing

---

## Roadmap

### ✅ Fase 1 — MVP
- [x] Onboarding
- [x] Cadastro e login
- [x] Recuperação de senha
- [x] Dashboard (Home)
- [x] Lista de cursos com busca e filtros
- [x] Mapa de lições (LessonView)
- [x] Tela de exercícios
- [x] Resultado de lição
- [x] Perfil, edição, histórico, configurações
- [x] Ranking semanal
- [x] XP e streak

### 🚧 Fase 2
- [ ] Gamificação avançada (ligas, divisões)
- [ ] Revisão inteligente
- [ ] Dashboard completo com analytics
- [ ] Backend C# + AWS

### 🔮 Fase 3
- [ ] IA adaptativa
- [ ] Ranking global
- [ ] Novos cursos
- [ ] Modo multiplayer

---

## Como Rodar

```bash
cd mobile
npm install
npx expo start
```

Abra no **Expo Go** (Android/iOS) ou emulador.

---

## Aviso

> `exercisescreens.tsx` usa sintaxe React Web (`CSSProperties`) e precisa ser reescrito em React Native para funcionar no app mobile.
