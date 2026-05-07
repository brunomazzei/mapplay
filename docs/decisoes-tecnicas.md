# Decisões Técnicas — MAPPLAY

> Registro das escolhas de arquitetura e tecnologia com justificativas. Toda decisão relevante deve ser documentada aqui para evitar retrabalho.

---

## Stack Frontend

| Tecnologia | Versão | Motivo |
|-----------|--------|--------|
| React | 18+ | Template do professor (Ecme) |
| TypeScript | 5+ | Template do professor; tipagem garante segurança |
| Vite | 5+ | Build tool do template |
| Tailwind CSS | 3+ | Estilização — já integrada no template |
| React Router | 6+ | Roteamento — já integrado |

**Arquivo de configuração central:** `src/configs/app.config.ts`

---

## Template Base: Ecme

O template Ecme oferece os seguintes recursos que **serão aproveitados** no MAPPLAY:

| Recurso do Template | Uso no MAPPLAY |
|--------------------|----------------|
| `auth/SignIn`, `SignUp`, `OtpVerification`, `ResetPassword` | Fluxo de autenticação (customizar campos) |
| `PostLoginLayout` com `SideNav` | Layout principal após login |
| `AuthorityGuard` | Controle de acesso por perfil (USER vs ADMIN) |
| `Calendar` | Visualização de eventos por data |
| `ImageGallery` | Galeria de fotos dos espaços |
| `Chart` (área, barra, donut) | Dashboard administrativo |
| `Settings` | Configurações e edição de perfil |
| `ActivityLog` | Histórico de atividades do usuário e espaço |
| `DataTable` | Listagens de espaços e eventos no admin |
| `ConfirmDialog` | Confirmações críticas (ex: cadastrar espaço) |
| `RichTextEditor` | Posts do fórum / descrições de eventos |

Recursos do template que **serão removidos** (não se aplicam ao MAPPLAY):
- AI Chat, Image Generator
- File Manager
- Pricing / Billing
- Help Center / Manage Articles
- Ecommerce (Orders, Products, Checkout)
- CRM / Customers (será substituído por perfil de usuário do MAPPLAY)

---

## Biblioteca de Mapas

**Status:** ✅ Decidido

- **Escolha: `react-leaflet` + `leaflet`** com tiles do OpenStreetMap
- Open source, sem custo de API, funciona offline (tiles cacheados), grande comunidade
- Compatível com Capacitor (WebView) sem restrições
- Instalação: `npm install leaflet react-leaflet` + `@types/leaflet`
- **Tela inicial = mapa em tela cheia** com chips de filtro por esporte sobrepostos

---

## Estratégia de Estado

| Tipo de estado | Solução |
|---------------|---------|
| Estado global (auth, tema, nav) | Zustand (já usado no template) |
| Estado de formulários | React Hook Form + Zod |
| Estado de servidor / cache | A definir (React Query / TanStack Query recomendado) |
| Estado local de componente | `useState` / `useReducer` |

---

## Autenticação

- Estratégia: **JWT** armazenado em `localStorage` (padrão do template)
- Fluxo: SignUp → OTP por email → SignIn → token salvo → rotas protegidas
- Guard de rotas: `ProtectedRoute` e `PublicRoute` já existem no template
- Dois perfis: `USER` (usuário comum) e `ADMIN` (gestão / parceiro governamental)

---

## Backend — Back4App (Parse Server)

**Status:** ✅ Decidido

Back4App é um BaaS (Backend-as-a-Service) baseado no **Parse Server** open source. Não é necessário escrever nem hospedar um servidor — toda a lógica de dados, autenticação e arquivos é gerenciada pela plataforma.

### Por que Back4App resolve o MAPPLAY

| Necessidade do MAPPLAY | Recurso Back4App |
|------------------------|-----------------|
| Autenticação (cadastro, login, OTP) | **Parse User** nativo |
| Geolocalização e busca por proximidade (RN01, RN03) | **Parse GeoPoint** com `withinKilometers` / `withinMiles` |
| Lógica de consenso democrático (RN01) | **Cloud Code** (funções serverless no Parse) |
| Upload de fotos dos espaços | **Parse Files** |
| Notificações em tempo real de mutirões | **Parse Push Notifications** + Back4App Push |
| Atualizações ao vivo no mapa | **Parse LiveQuery** (WebSocket gerenciado) |
| Dashboard de dados para admin | **Back4App Dashboard** (já embutido) |

### SDK e instalação
```bash
npm install parse
npm install --save-dev @types/parse
```

### Configuração inicial (`src/services/parseConfig.ts`)
```ts
import Parse from 'parse'

Parse.initialize(
  import.meta.env.VITE_BACK4APP_APP_ID,
  import.meta.env.VITE_BACK4APP_JS_KEY
)
Parse.serverURL = 'https://parseapi.back4app.com'
```

Variáveis de ambiente necessárias em `.env`:
```
VITE_BACK4APP_APP_ID=...
VITE_BACK4APP_JS_KEY=...
```

### Classes (tabelas) necessárias no Back4App

| Classe Parse | Equivale a |
|-------------|-----------|
| `_User` | Usuários (nativo do Parse) |
| `Espaco` | Espaços públicos cadastrados |
| `RegistroEspaco` | Cada envio individual (para o consenso RN01) |
| `Avaliacao` | Avaliações de conservação por usuário |
| `Evento` | Peladas e mutirões |
| `ParticipacaoEvento` | Relação usuário ↔ evento |
| `PostForum` | Posts de discussão por espaço |

### Cloud Code para RN01 (consenso democrático)
A lógica de validação automática ao atingir 3 registros será implementada como um **afterSave trigger** no Cloud Code do Back4App:
```js
// main.js no Cloud Code do Back4App
Parse.Cloud.afterSave('RegistroEspaco', async (request) => {
  // Busca registros no raio de 50m do mesmo ponto
  // Se count >= 3 e não há Espaco validado → cria/valida o Espaco
})
```

### Geolocalização — GeoPoint
O campo de localização dos espaços usa o tipo nativo `Parse.GeoPoint`:
```ts
const localizacao = new Parse.GeoPoint(latitude, longitude)
espaco.set('localizacao', localizacao)

// Query por proximidade (50m de raio para consenso)
query.withinKilometers('localizacao', pontoReferencia, 0.05)
```
Isso **elimina a necessidade de PostGIS** — o Parse gerencia as geoqueries nativamente.

---

## Geolocalização

- Captura no front-end via `@capacitor/geolocation` (nativo Android/iOS) com fallback para `navigator.geolocation` (web/browser)
- Raio de tolerância para agrupamento de cadastros (RN01): **50 metros** *(sugestão — validar com professor)*
- Armazenamento: campo `Parse.GeoPoint` na classe `Espaco` e `RegistroEspaco`
- Busca por proximidade: `query.withinKilometers('localizacao', ponto, 0.05)` — nativo do Parse, sem PostGIS
- Notificações de mutirão: Back4App Push com filtro de canal por região/bairro

---

## Estratégia Mobile — Capacitor

**Status:** ✅ Decidido

O app será desenvolvido como **web app** (React + Vite) e empacotado para Android e iOS via **Capacitor** (Ionic).

### Por que Capacitor
- Funciona com qualquer framework web — React + Vite são oficialmente suportados
- Gera `.apk` / `.aab` para Android e `.ipa` para iOS a partir do mesmo código
- Dá acesso a APIs nativas: câmera, GPS, notificações push, armazenamento
- Processo: `build web → sync Capacitor → abrir Android Studio / Xcode → gerar pacote`

### Fluxo de exportação
```
npm run build          # gera /dist
npx cap sync           # copia /dist para as pastas android/ e ios/
npx cap open android   # abre Android Studio → gerar .apk
npx cap open ios       # abre Xcode → gerar .ipa (requer Mac)
```

### Plugins Capacitor necessários
| Plugin | Uso |
|--------|-----|
| `@capacitor/geolocation` | Captura GPS para cadastro de espaços (RN03) |
| `@capacitor/camera` | Upload de fotos dos espaços |
| `@capacitor/push-notifications` | Notificações de mutirões próximos |
| `@capacitor/local-notifications` | Notificações locais de eventos |

### Impacto no layout
- Todo layout deve ser **mobile-first** (telas de ~390px de largura)
- Evitar hover states como única interação — preferir tap/click
- Respeitar safe areas do iOS (`env(safe-area-inset-*)`) via Tailwind
- Sem SideNav lateral — usar **bottom navigation bar** como padrão mobile

### Configuração inicial (Fase 0)
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

---

## Convenções de Código

- Componentes: PascalCase em pasta própria com `index.ts` exportando
- Views: `src/views/mapplay/NomeDaView/`
- Serviços de API: `src/services/`
- Tipos globais: `src/types/` (separado dos `@types` do template)
- Sem comentários descritivos — código autodocumentado por nomes claros

---

## Referências

- [[roadmap-desenvolvimento]] — Fases de implementação
- [[regras-de-negocio]] — RNs que guiam as decisões técnicas
- [[escopo-projeto-mapplay]] — Escopo original
