# Roadmap de Desenvolvimento — MAPPLAY

> **Contexto:** Plataforma de rede social esportiva baseada em crowdsourcing e VGI (Informação Geográfica Voluntária) para mapeamento colaborativo de espaços públicos de basquete, futebol e skate.
>
> **Stack base:** Template Ecme (React + TypeScript + Vite + Tailwind CSS) com mock API integrado.
> **Alvo de entrega:** App mobile (.apk Android + .ipa iOS) via **Capacitor**. Desenvolvido como web, exportado como nativo.
> **Tela inicial (pós-login):** Mapa em tela cheia com chips de filtro por esporte sobrepostos.

---

## Visão Geral das Fases

| Fase | Tema | Prioridade | Status |
|------|------|-----------|--------|
| 0 | Setup e Identidade Visual | Alta | ✅ Concluída |
| 1 | Autenticação e Perfil do Usuário | Alta | ✅ Concluída |
| 2 | Mapa Interativo e Cadastro de Espaços | Alta (Core) | ✅ Concluída |
| 3 | Perfil dos Espaços e Avaliações | Alta | ✅ Concluída |
| 4 | Eventos e Mobilização Comunitária | Média | ✅ Concluída |
| 5 | Fórum e Zeladoria Coletiva | Média | ✅ Concluída |
| 6 | Dashboard Administrativo | Média | ⬜ Pendente |
| 7 | Integração com Backend Real | Alta | ⬜ Pendente |
| 8 | Revisão Final e Entrega | Alta | ⬜ Pendente |

---

## Fase 0 — Setup e Identidade Visual

**Objetivo:** Transformar o template genérico em base do MAPPLAY, configurar Capacitor para mobile e estabelecer a estrutura mobile-first do projeto.

### Tarefas — Identidade e Limpeza
- [ ] Definir paleta de cores (identidade urbana/esportiva)
- [ ] Configurar logo e branding MAPPLAY em `src/components/template/Logo.tsx` e `HeaderLogo.tsx`
- [ ] Alterar locale padrão para `pt-BR` em `app.config.ts` e `src/locales/`
- [ ] Remover páginas do template que não serão utilizadas (AI Chat, FileManager, Pricing, Billing, Ecommerce, etc.)
- [ ] Configurar rota de entrada autenticada para o mapa (`/mapa`) em `app.config.ts`
- [ ] Estruturar a árvore de rotas do MAPPLAY em `src/configs/routes.config/`

### Tarefas — Layout Mobile
- [ ] Substituir `SideNav` lateral por **Bottom Navigation Bar** (padrão mobile)
  - Abas: Mapa / Explorar / Eventos / Perfil
- [ ] Configurar Tailwind com safe-areas do iOS (`env(safe-area-inset-*)`)
- [ ] Garantir que todas as telas funcionem em 390px de largura (iPhone 14 base)

### Tarefas — Capacitor
- [ ] Instalar e inicializar Capacitor:
  ```bash
  npm install @capacitor/core @capacitor/cli
  npx cap init "MapPlay" "br.edu.mapplay"
  npm install @capacitor/android @capacitor/ios
  npx cap add android
  ```
- [ ] Instalar plugins necessários:
  ```bash
  npm install @capacitor/geolocation @capacitor/camera @capacitor/push-notifications
  ```
- [ ] Configurar `capacitor.config.ts` com `webDir: "dist"`
- [ ] Validar primeiro build de teste no Android Studio

### Entregas
- Template com identidade visual MAPPLAY e layout mobile-first
- Bottom navigation funcional
- Capacitor configurado e gerando APK de teste

---

## Fase 1 — Autenticação e Perfil do Usuário

**Objetivo:** Adaptar o fluxo de autenticação do template e construir o perfil público do usuário conforme o escopo.

### Tarefas — Autenticação
- [ ] Customizar a tela de cadastro (`SignUp`) com campos: nome, região/bairro, esportes praticados
- [ ] Manter fluxo: SignUp → OTP Verification → SignIn
- [ ] Customizar telas de recuperação de senha (ForgotPassword, ResetPassword)
- [ ] Remover opções de OAuth que não serão usadas (Google, Facebook — se não aplicável)

### Tarefas — Perfil do Usuário
- [ ] Criar view `src/views/mapplay/UserProfile/` com:
  - Foto, nome e região
  - Esportes praticados (badges)
  - Histórico: eventos criados, participações em peladas, engajamento em revitalizações
- [ ] Adaptar `Settings` existente para edição de perfil do usuário
- [ ] Implementar `ActivityLog` para histórico de atividades do usuário

### Regras de Negócio Relacionadas
- Perfil é público
- Esportes praticados e região são obrigatórios no cadastro

---

## Fase 2 — Mapa Interativo e Cadastro de Espaços ⭐ Core

**Objetivo:** Implementar a funcionalidade central da plataforma — o mapa colaborativo de espaços públicos.

### Tarefas — Integração do Mapa
- [ ] Instalar `react-leaflet` e `leaflet` + `@types/leaflet`
- [ ] Criar view `src/views/mapplay/MapView/` com **mapa em tela cheia** (100vh)
- [ ] Implementar geolocalização via `@capacitor/geolocation` (nativo) com fallback para `navigator.geolocation` (web)
- [ ] Criar marcadores (pins) diferenciados por modalidade (basquete 🏀 / futebol ⚽ / skate 🛹)
- [ ] Chips de filtro por esporte **sobrepostos ao mapa** (posição: topo da tela, abaixo da status bar)

### Tarefas — Filtros do Mapa
- [ ] Filtro por modalidade esportiva
- [ ] Filtro por bairro/região
- [ ] Filtro por iluminação (sim/não)
- [ ] Filtro por tipo de pavimentação

### Tarefas — Cadastro de Espaço (RN01–RN04)
- [ ] Criar formulário `src/views/mapplay/SpaceRegister/` com:
  - Captura automática de coordenadas GPS (latitude/longitude) — **obrigatório (RN03)**
  - Campo de confirmação de espaço público (praças, centros comunitários) — **(RN02)**
  - Campos específicos por modalidade **(RN04)**:
    - Basquete: altura da cesta
    - Skate: tipo de obstáculo
    - Futebol: tipo de gramado
  - Upload de foto do local
- [ ] Implementar lógica de **Consenso Democrático (RN01)**:
  - Novo espaço entra em estado "aguardando validação"
  - Mapa exibe espaços confirmados (≥ 3 registros do mesmo local) e pendentes com indicador visual diferente
  - Ao atingir 3 confirmações, espaço é validado automaticamente

### Entregas
- Mapa funcional com pins por modalidade
- Filtros operacionais
- Fluxo de cadastro completo com validação por consenso

---

## Fase 3 — Perfil dos Espaços e Avaliações

**Objetivo:** Criar a "ficha" de cada espaço, equivalente a uma página de local no Google Maps, adaptada para zeladoria urbana.

### Tarefas — Perfil do Espaço
- [ ] Criar view `src/views/mapplay/SpaceDetail/` com:
  - Nome e endereço do espaço
  - Galeria de fotos (usar `ImageGallery` do template)
  - Modalidade e atributos técnicos (conforme RN04)
  - Status atual de conservação
  - Histórico de atividades do espaço
  - Lista de eventos ativos no local

### Tarefas — Sistema de Avaliação
- [ ] Implementar avaliação obrigatória em **3 níveis**:
  - ✅ Ótimo
  - ⚠️ Necessita de reparos
  - 🚫 Somente com revitalização
- [ ] Exibir avaliação média e distribuição de avaliações no perfil do espaço
- [ ] Permitir envio de foto recente como comprovação do estado atual

---

## Fase 4 — Eventos e Mobilização Comunitária

**Objetivo:** Permitir que usuários criem e participem de eventos esportivos e de zeladoria nos espaços mapeados.

### Tarefas — Eventos Esportivos ("Peladas" / "Rolês")
- [ ] Criar formulário de criação de evento em `src/views/mapplay/EventCreate/`
  - Espaço vinculado, modalidade, data/hora, número de vagas, descrição
- [ ] Criar view de listagem de eventos por espaço e globalmente
- [ ] Reutilizar `Calendar` do template para visualização de eventos por data
- [ ] Implementar ação de "Quero participar!" com controle de vagas

### Tarefas — Eventos de Zeladoria ("Mutirões")
- [ ] Diferenciar criação de evento: tipo "Zeladoria" vs. "Esportivo"
- [ ] Exibir mutirões na página do espaço com status de conservação vinculado
- [ ] Sistema de notificação para usuários próximos ao local do mutirão **(RN05 / notificação por proximidade)**

---

## Fase 5 — Fórum e Zeladoria Coletiva

**Objetivo:** Criar o espaço de discussão comunitária por espaço, onde usuários organizam mutirões por iniciativa própria.

### Tarefas
- [ ] Criar seção de fórum dentro do perfil de cada espaço (`SpaceDetail/Forum`)
  - Reutilizar estrutura do `Chat` do template ou criar lista de posts simples
- [ ] Publicar posts/mensagens de mobilização
- [ ] Notificar usuários inscritos no espaço sobre novas postagens
- [ ] Limpar escopo: fórum **não substitui responsabilidade de manutenção** — inserir aviso (RN05)

---

## Fase 6 — Dashboard Administrativo

**Objetivo:** Construir a visão analítica de dados para administradores e parceiros governamentais (RN06).

### Tarefas — Estatísticas Abertas (todos os usuários)
- [ ] Número de espaços por modalidade e por bairro
- [ ] Ranking de espaços com mais atividade
- [ ] Total de eventos realizados e usuários ativos

### Tarefas — Dashboard Analítico (perfil admin/parceiro)
- [ ] Criar view `src/views/mapplay/AdminDashboard/`
  - Reutilizar componentes de `Chart` (área, barra, donut) do template
  - Mapa de calor de espaços críticos (avaliação ruim)
  - Evolução do status de conservação por região ao longo do tempo
  - Exportação de dados (CSV)
- [ ] Implementar controle de acesso por perfil (`AuthorityGuard` já existe no template)

---

## Fase 7 — Integração com Back4App

**Objetivo:** Substituir os mocks do template pelo Parse SDK conectado ao Back4App, ativando persistência real de dados.

> **Nota:** Por ser BaaS, não há servidor para configurar. A integração é feita direto no front-end via SDK.

### Tarefas — Configuração inicial
- [ ] Criar conta e projeto no Back4App (back4app.com)
- [ ] Criar classes no Dashboard do Back4App: `Espaco`, `RegistroEspaco`, `Avaliacao`, `Evento`, `ParticipacaoEvento`, `PostForum`
- [ ] Instalar SDK: `npm install parse`
- [ ] Criar `src/services/parseConfig.ts` com inicialização do Parse
- [ ] Criar `.env` com `VITE_BACK4APP_APP_ID` e `VITE_BACK4APP_JS_KEY`
- [ ] Desabilitar mock: `enableMock: false` em `app.config.ts`

### Tarefas — Autenticação
- [ ] Migrar `SignIn` e `SignUp` para usar `Parse.User.logIn()` e `Parse.User.signUp()`
- [ ] Migrar recuperação de senha para `Parse.User.requestPasswordReset()`
- [ ] Substituir token JWT do template pela sessão nativa do Parse (`Parse.User.current()`)

### Tarefas — Dados e Serviços
- [ ] Criar `src/services/espacoService.ts` — CRUD de espaços com `Parse.GeoPoint`
- [ ] Criar `src/services/registroService.ts` — envio de confirmações de espaço
- [ ] Criar `src/services/eventoService.ts` — criação e participação em eventos
- [ ] Criar `src/services/avaliacaoService.ts` — avaliações de conservação
- [ ] Criar `src/services/forumService.ts` — posts por espaço

### Tarefas — Cloud Code (Back4App)
- [ ] Implementar `afterSave` em `RegistroEspaco` para lógica de consenso (RN01):
  - Conta registros num raio de 50m
  - Se ≥ 3 → cria/valida o objeto `Espaco` automaticamente
- [ ] Implementar Cloud Job de notificação por proximidade para mutirões

### Tarefas — Tempo Real e Arquivos
- [ ] Ativar **LiveQuery** no Back4App e assinar a classe `Espaco` para atualização do mapa em tempo real
- [ ] Migrar upload de fotos para `Parse.File`
- [ ] Configurar **Back4App Push** com `@capacitor/push-notifications`

---

## Fase 8 — Revisão Final e Entrega

**Objetivo:** Garantir qualidade, gerar os pacotes mobile e entregar o projeto.

### Tarefas — Qualidade
- [ ] Teste de todos os fluxos principais em dispositivo físico ou emulador Android
- [ ] Revisão das Regras de Negócio (RN01 a RN06) — todas implementadas?
- [ ] Ajuste da documentação em `/docs`
- [ ] Preparar roteiro de demonstração (demo script)

### Tarefas — Build Mobile
- [ ] `npm run build` → `npx cap sync`
- [ ] Gerar `.apk` de release no Android Studio (Build > Generate Signed APK)
- [ ] Testar APK em dispositivo físico Android
- [ ] (Opcional / se houver Mac disponível) Gerar `.ipa` para iOS via Xcode

### Tarefas — Deploy Web (versão de demonstração)
- [ ] Deploy do frontend em Vercel ou Netlify
- [ ] Deploy do backend em Railway ou Render

---

## Decisões Técnicas Registradas

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Framework frontend | React + TypeScript (Ecme template) | Definido pelo professor |
| Biblioteca de mapas | `react-leaflet` + OpenStreetMap | Open source, sem custo, compatível com Capacitor |
| Estratégia mobile | Capacitor (web → APK/IPA) | Reaproveitamento total do código React/Vite |
| Layout | Mobile-first, bottom navigation | App mobile como entrega principal |
| Locale | pt-BR | Projeto nacional |
| Estratégia de auth | JWT em localStorage | Configuração padrão do template |
| Mock API | Habilitado nas fases 0–6, desativado na Fase 7 | Permite desenvolvimento sem back4app configurado |
| Backend | Back4App (Parse Server BaaS) | Sem servidor para hospedar; GeoPoint nativo elimina PostGIS |

---

## Links Internos

- [[escopo-projeto-mapplay]] — Documento original de escopo
- [[decisoes-tecnicas]] — Registro detalhado de decisões de arquitetura
- [[regras-de-negocio]] — Detalhamento das RNs *(a criar)*
