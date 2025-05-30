# 🌱 EcoRecicla - Plataforma de Reciclagem Inteligente

Uma aplicação web moderna e completa que gamifica o processo de reciclagem, permitindo que usuários ganhem pontos por ações sustentáveis e troquem por recompensas reais. Desenvolvida com React, TypeScript, Firebase e design responsivo.

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#%EF%B8%8F-tecnologias)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🔄 Fluxo da Aplicação](#-fluxo-da-aplicação)
- [🧮 Lógica de Negócio e Algoritmos](#-lógica-de-negócio-e-algoritmos)
- [🏗️ Arquitetura](#%EF%B8%8F-arquitetura)
- [🚀 Como Executar](#-como-executar)
- [🔐 Segurança](#-segurança)
- [📱 Responsividade](#-responsividade)
- [🎨 Design System](#-design-system)

## 🎯 Visão Geral

O **EcoRecicla** é uma plataforma completa que incentiva a reciclagem através de um sistema de gamificação. Os usuários podem registrar suas atividades de reciclagem, acumular pontos e trocar por recompensas como vouchers, descontos e produtos.

### Principais Diferenciais

- **Sistema de Pontuação Inteligente**: Algoritmo que calcula pontos baseado em material, peso, localização e bônus
- **Mapa Interativo**: Visualização de pontos de coleta próximos com informações detalhadas
- **Presente de Boas-vindas**: Sistema automatizado para novos usuários
- **Gamificação Completa**: Níveis, conquistas e sistema de ranking
- **Interface Moderna**: Design responsivo com modo escuro/claro
- **Real-time**: Atualizações em tempo real de saldo e transações

## ✨ Funcionalidades

### 🔐 Autenticação e Perfil
- Login/registro com validação completa
- Perfil do usuário com upload de foto
- Validação de CPF e CEP automatizada
- Sistema de recuperação de senha
- Presente de boas-vindas (50 pontos) para novos usuários

### ♻️ Sistema de Reciclagem
- **Modal de Reciclagem em 4 Etapas**:
  1. Seleção de material (8 tipos disponíveis)
  2. Inserção de peso (kg/g) com validação
  3. Escolha do ponto de coleta
  4. Confirmação e geração de código

- **Cálculo Inteligente de Pontos**:
  - Pontos base por material
  - Bônus por peso (acima de 1kg)
  - Bônus por localização específica
  - Multiplicadores especiais

### 🎁 Sistema de Recompensas
- **Categorias**: Alimentação, Transporte, Compras, Entretenimento, Educação
- **Tipos de Recompensa**: Vouchers, descontos, cashback, ingressos
- **Sistema de Cooldown**: Evita resgate excessivo
- **Histórico Completo**: Tracking de todas as recompensas resgatadas

### 🗺️ Mapa Interativo
- Visualização de pontos de coleta
- Filtros por tipo de material
- Cálculo de distância em tempo real
- Informações detalhadas (horários, telefone, materiais aceitos)
- Geolocalização do usuário

### 📊 Dashboard e Analytics
- **Métricas em Tempo Real**:
  - Saldo atual de pontos
  - Total ganho e gasto
  - Estatísticas de reciclagem
  - Ranking e nível do usuário

- **Gráficos e Visualizações**:
  - Histórico mensal
  - Materiais mais reciclados
  - Impacto ambiental (CO2 economizado)

### 🏆 Sistema de Gamificação
- **Níveis de Usuário**: Bronze, Prata, Ouro, Platina, Diamante
- **Sistema de XP**: Baseado em pontos totais ganhos
- **Ranking Global**: Competição saudável entre usuários

## 🛠️ Tecnologias

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)

### 🎨 Frontend
- **⚛️ React 19.1.0** - Framework principal para interfaces reativas
- **📝 TypeScript** - Tipagem estática para maior segurança e produtividade
- **⚡ Vite** - Build tool moderna e dev server ultrarrápido
- **🎨 Tailwind CSS 4.1.8** - Framework CSS utilitário para design consistente
- **🧭 React Router Dom 7.6.1** - Roteamento SPA com navegação suave

### ☁️ Backend e Cloud
- **🔥 Firebase** - Plataforma completa do Google
  - **🔐 Authentication** - Sistema de autenticação seguro
  - **💾 Firestore** - Banco de dados NoSQL em tempo real
  - **⚡ Functions** - Serverless functions (Node.js 20)
  - **📦 Storage** - Upload e armazenamento de arquivos
  - **🌐 Hosting** - Deploy e hospedagem da aplicação

### 🗺️ Bibliotecas Especializadas
- **🗺️ React Leaflet 5.0.0** - Mapas interativos e responsivos
- **🌍 Leaflet 1.9.4** - Engine de mapas open-source
- **📍 Geolib 3.3.4** - Cálculos geográficos precisos
- **🌐 Turf.js 7.2.0** - Análise geoespacial avançada
- **🎯 Lucide React** - Biblioteca de ícones modernos e consistentes
- **📊 React CountUp** - Animações numéricas suaves

### 🔧 Desenvolvimento
- **🔍 ESLint** - Linting para qualidade de código
- **📋 TypeScript ESLint** - Linting específico para TypeScript
- **🔌 Vite Plugin React** - Integração otimizada React/Vite

## 📁 Estrutura do Projeto

```
Interface-Reciclagem/
├── 📄 Arquivos de Configuração
│   ├── package.json          # Dependências e scripts
│   ├── vite.config.ts        # Configuração do Vite
│   ├── tailwind.config.cjs   # Configuração do Tailwind
│   ├── tsconfig.json         # Configuração do TypeScript
│   ├── firebase.json         # Configuração do Firebase
│   └── eslint.config.js      # Configuração do ESLint
│
├── 🔥 Firebase Functions
│   └── functions/
│       ├── package.json      # Dependências das functions
│       ├── tsconfig.json     # TS config para functions
│       └── src/
│           └── index.ts      # Cloud Functions principais
│
├── 🌐 Frontend (src/)
│   ├── 📱 Páginas Principais
│   │   ├── LandingPage.tsx   # Página inicial pública
│   │   ├── LoginPage.tsx     # Login/Registro
│   │   ├── DashboardPage.tsx # Dashboard principal
│   │   ├── UserProgramPage.tsx    # Programa de usuário
│   │   ├── BusinessProgramPage.tsx # Programa empresarial
│   │   └── PartnerPage.tsx   # Página de parceiros
│   │
│   ├── 🧩 Componentes
│   │   ├── layout/           # Layout da aplicação
│   │   │   ├── Header.tsx    # Cabeçalho responsivo
│   │   │   └── Footer.tsx    # Rodapé
│   │   │
│   │   ├── sections/         # Seções da landing page
│   │   │   ├── HeroSection.tsx       # Hero com animações
│   │   │   ├── AboutSection.tsx      # Sobre a empresa
│   │   │   ├── FeaturesSection.tsx   # Funcionalidades
│   │   │   ├── MaterialsSection.tsx  # Materiais recicláveis
│   │   │   └── CTASection.tsx        # Call to action
│   │   │
│   │   ├── ui/               # Componentes reutilizáveis
│   │   │   ├── Logo.tsx      # Logo da aplicação
│   │   │   ├── ThemeToggle.tsx # Toggle dark/light mode
│   │   │   ├── Toast.tsx     # Sistema de notificações
│   │   │   ├── ToastProvider.tsx # Provider de toasts
│   │   │   ├── StatCard.tsx  # Cards de estatísticas
│   │   │   └── AnimatedCounter.tsx # Contadores animados
│   │   │
│   │   └── Modais Principais
│   │       ├── RecyclingModal.tsx    # Modal de reciclagem
│   │       ├── RewardsModal.tsx      # Modal de recompensas
│   │       ├── MapModal.tsx          # Modal do mapa
│   │       ├── ProfileModal.tsx      # Modal de perfil
│   │       ├── WelcomeGiftButton.tsx # Presente de boas-vindas
│   │       └── TransactionHistoryFull.tsx # Histórico completo
│   │
│   ├── 🎣 Hooks Customizados
│   │   ├── useAuth.ts        # Autenticação e usuário
│   │   ├── useRecycling.ts   # Sistema de reciclagem
│   │   ├── useRewards.ts     # Sistema de recompensas
│   │   ├── useUserBalance.ts # Saldo do usuário
│   │   ├── useUserStats.ts   # Estatísticas do usuário
│   │   ├── useWelcomeGift.ts # Presente de boas-vindas
│   │   ├── useFirebaseFunctions.ts # Cloud Functions
│   │   ├── useCEP.ts         # Validação de CEP
│   │   └── useToast.ts       # Sistema de notificações
│   │
│   ├── 🔧 Serviços
│   │   └── firestoreService.ts # Interação com Firestore
│   │
│   ├── 🔗 Configurações
│   │   └── lib/
│   │       └── firebase.ts   # Configuração do Firebase
│   │
│   └── 🛠️ Utilitários
│       └── utils/
│           └── geocoding.ts  # Funções de geolocalização
│
└── 📦 Assets Estáticos
    └── public/
        └── logo.svg          # Logo da aplicação
```

## 🔄 Fluxo da Aplicação

### 1. 🌐 Acesso Inicial
```
Landing Page → Header com navegação → Seções informativas → CTA para registro
```

### 2. 🔐 Autenticação
```
Login/Registro → Validação de dados → Firebase Auth → Redirecionamento para Dashboard
```

### 3. 🎁 Primeiro Acesso
```
Dashboard → Verificação de elegibilidade → Presente de boas-vindas → +50 pontos
```

### 4. ♻️ Processo de Reciclagem
```
Dashboard → "Nova Reciclagem" → Modal de 4 etapas:
├── Etapa 1: Seleção de Material
├── Etapa 2: Inserção de Peso
├── Etapa 3: Escolha do Local
└── Etapa 4: Confirmação → Cálculo de Pontos → Atualização do Saldo
```

### 5. 🎁 Resgate de Recompensas
```
Dashboard → "Recompensas" → Filtros por categoria → Seleção → Confirmação → Desconto do saldo
```

### 6. 🗺️ Exploração de Locais
```
Dashboard → "Mapa" → Visualização de pontos → Filtros → Detalhes do local
```

## 🧮 Lógica de Negócio e Algoritmos

### 💡 Algoritmo de Pontuação Inteligente

O sistema de pontuação é baseado em múltiplos fatores para incentivar comportamentos sustentáveis:

```typescript
// Fórmula de cálculo de pontos
pontosTotais = pontosBase × multiplicadorPeso × multiplicadorLocal × bonusEspecial

// Pontos base por material (por kg)
const pontosBaseMaterial = {
  'papel': 10,
  'plastico': 15,
  'vidro': 8,
  'metal': 20,
  'eletronicos': 50,
  'pilhas': 30,
  'oleo': 25,
  'organico': 5
}

// Multiplicadores por peso
const multiplicadorPeso = peso >= 1 ? 1.5 : 1.0  // 50% bônus para +1kg

// Multiplicador por localização (pontos de coleta parceiros)
const multiplicadorLocal = local.isParceiro ? 1.2 : 1.0  // 20% bônus

// Sistema de bônus especiais
const bonusEspecial = {
  'primeiro_mes': 2.0,      // Dobro de pontos no primeiro mês
  'final_semana': 1.3,      // 30% a mais nos fins de semana
  'meta_mensal': 1.5        // 50% a mais ao atingir meta mensal
}
```

### 🎯 Sistema de Gamificação

#### **Níveis e Progressão**
```typescript
// Sistema de níveis baseado em XP total
const niveis = {
  'bronze': { min: 0, max: 500, cor: '#CD7F32' },
  'prata': { min: 501, max: 1500, cor: '#C0C0C0' },
  'ouro': { min: 1501, max: 3000, cor: '#FFD700' },
  'platina': { min: 3001, max: 5000, cor: '#E5E4E2' },
  'diamante': { min: 5001, max: Infinity, cor: '#B9F2FF' }
}

// XP = Total de pontos ganhos historicamente
// Cada nível desbloqueia novos benefícios e recompensas
```
### 💰 Economia de Pontos

#### **Cooldown e Rate Limiting**
```typescript
// Sistema anti-abuso
const cooldowns = {
  'recycling': 5, // minutos entre reciclagens
  'reward_claim': 60, // minutos entre resgates da mesma recompensa
  'welcome_gift': 'once_per_user' // presente único
}

// Validações de negócio
const validacoes = {
  'peso_minimo': 0.1, // kg mínimo
  'peso_maximo': 100, // kg máximo por reciclagem
  'distancia_maxima': 50, // km do ponto de coleta
  'saldo_minimo_resgate': 10 // pontos mínimos para resgate
}
```

### 🔄 Fluxo de Dados em Tempo Real

```typescript
// Arquitetura de dados reativa
1. Usuário registra reciclagem
   ↓ (Cloud Function: addRecyclingPoints)
2. Validações de negócio
   ↓ (Firestore Transaction)
3. Cálculo de pontos + bônus
   ↓ (Atomic Update)
4. Atualização do saldo
   ↓ (Real-time Listener)
5. UI atualizada instantaneamente
   ↓ (React Hook + State)
6. Notificação de sucesso
```

## 🏗️ Arquitetura

### 🎨 Frontend Architecture

#### **Padrão de Componentes**
- **Smart Components**: Páginas com lógica de estado
- **Dumb Components**: Componentes reutilizáveis
- **Custom Hooks**: Lógica de negócio isolada
- **Context API**: Estado global (Theme, Toast)

#### **Estado da Aplicação**
```typescript
// Estado distribuído entre hooks customizados
useAuth()         // Usuário logado e autenticação
useUserBalance()  // Saldo e transações em tempo real
useRecycling()    // Lógica de reciclagem
useRewards()      // Sistema de recompensas
useUserStats()    // Estatísticas e analytics
useWelcomeGift()  // Presente de boas-vindas
```

#### **Roteamento**
```typescript
// Estrutura de rotas
/ (LandingPage)           // Página pública
/login                    // Login/Registro
/dashboard               // Dashboard principal (protegido)
/user-program           // Programa de usuário
/business-program       // Programa empresarial
/partner                // Página de parceiros
/app-download          // Download do app
```

### ⚡ Backend Architecture (Firebase Functions)

#### **Cloud Functions Principais**
```typescript
// Funções serverless principais
addRecyclingPoints()     // Adicionar pontos de reciclagem
spendPointsOnReward()    // Gastar pontos em recompensas
getUserBalance()         // Obter saldo do usuário
getUserTransactions()    // Listar transações
addBonusPoints()         // Adicionar pontos de bônus
getUserStats()           // Estatísticas do usuário
claimWelcomeGift()       // Resgatar presente de boas-vindas
checkWelcomeGiftEligibility() // Verificar elegibilidade
```

#### **Modelo de Dados (Firestore)**
```typescript
// Collections principais
users/           // Dados dos usuários
├── uid          // ID único
├── email        // Email
├── firstName    // Nome
├── lastName     // Sobrenome
├── cpf          // CPF
├── address      // Endereço completo
├── welcomeGiftClaimed // Status do presente
└── ...

balances/        // Saldo dos usuários
├── uid          // ID do usuário
├── currentBalance // Saldo atual
├── totalEarned  // Total ganho
├── totalSpent   // Total gasto
├── recyclingCount // Número de reciclagens
└── updatedAt    // Última atualização

transactions/    // Histórico de transações
├── uid          // ID do usuário
├── type         // Tipo: 'recycling' | 'reward' | 'bonus'
├── points       // Pontos da transação
├── material     // Material reciclado (se aplicável)
├── weight       // Peso (se aplicável)
├── location     // Local (se aplicável)
├── rewardName   // Nome da recompensa (se aplicável)
├── timestamp    // Data/hora
└── description  // Descrição da transação
```

### 🔐 Sistema de Segurança

#### **Autenticação**
- Firebase Authentication
- Validação de token em todas as functions
- Proteção de rotas no frontend

#### **Autorização**
- Usuários só acessam seus próprios dados
- Validação de UID em todas as operações
- Rules do Firestore para proteção adicional

#### **Validação de Dados**
- Validação no frontend (UX)
- Validação nas Cloud Functions (segurança)
- Normalização de números (vírgula/ponto)
- Sanitização de inputs

## 🚀 Como Executar

### Pré-requisitos
- Node.js 20+
- Firebase CLI
- Git

### 1. Clonar o Repositório
```bash
git clone <repository-url>
cd Interface-Reciclagem
```

### 2. Configurar Dependências
```bash
# Frontend
npm install

# Firebase Functions
cd functions
npm install
cd ..
```

### 3. Configurar Firebase
```bash
# Login no Firebase
firebase login

# Configurar projeto
firebase init

# Criar arquivo .env com suas chaves do Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Executar em Desenvolvimento
```bash
# Frontend (http://localhost:5173)
npm run dev

# Firebase Functions (emulador)
cd functions
npm run serve
```

### 5. Build e Deploy
```bash
# Build do frontend
npm run build

# Deploy completo no Firebase
firebase deploy
```

## 🔐 Segurança

### Proteções Implementadas
- **Autenticação obrigatória**: Todas as functions verificam autenticação
- **Validação de dados**: Inputs sanitizados e validados
- **Rate limiting**: Prevenção de spam através de cooldowns
- **Transações atômicas**: Consistência de dados garantida
- **Rules do Firestore**: Proteção adicional no banco de dados

### Boas Práticas
- Tokens JWT validados em cada requisição
- Dados sensíveis apenas no backend
- Logs de auditoria em transações importantes
- Criptografia de dados sensíveis

## 📱 Responsividade

### Breakpoints
```css
/* Mobile First Approach */
mobile:   320px - 768px   /* Smartphones */
tablet:   768px - 1024px  /* Tablets */
desktop:  1024px+         /* Desktops */
```

### Adaptações por Dispositivo
- **Mobile**: Interface simplificada, navegação por touch
- **Tablet**: Layout híbrido, aproveitamento do espaço
- **Desktop**: Interface completa, múltiplas colunas

## 🎨 Design System

### Cores Principais
```css
/* Sistema de cores */
green:   #10B981 - #065F46  /* Sustentabilidade */
blue:    #3B82F6 - #1E40AF  /* Tecnologia */
purple:  #8B5CF6 - #5B21B6  /* Gamificação */
gray:    #6B7280 - #1F2937  /* Neutro */
```

### Componentes
- **Cards**: Backdrop blur, bordas suaves
- **Buttons**: Gradientes, hover effects
- **Modais**: Overlay blur, animações suaves
- **Formulários**: Validação visual, feedback imediato

### Animações
- **Hover effects**: Transformações suaves
- **Loading states**: Skeletons e spinners
- **Transitions**: Duração padronizada (300ms)
- **Custom animations**: Float, twinkle, drift

---

**Desenvolvido com 💚 para um futuro mais sustentável**

**Autor:** [Pedro Bolson](https://github.com/PedroBolson)

*Este projeto representa uma solução completa para gamificação da reciclagem, combinando tecnologia moderna com impacto ambiental positivo.*