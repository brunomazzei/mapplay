# MapPlay 🗺️

Aplicativo mobile-first para mapeamento colaborativo de espaços públicos esportivos — quadras de basquete, campos de futebol e pistas de skate. Desenvolvido como Projeto Integrador do 5° semestre de ADS.

---

## Sobre o projeto

O MapPlay permite que a própria comunidade cadastre, confirme e avalie espaços esportivos públicos próximos. Um sistema de consenso democrático garante que apenas locais reais sejam validados: são necessárias 3 confirmações de usuários diferentes para um espaço aparecer no mapa para todos.

### Funcionalidades principais

- **Mapa interativo** com filtros por modalidade (basquete, futebol, skate) e iluminação
- **Cadastro de espaços** com localização via GPS e pin ajustável no mapa
- **Consenso democrático** (RN01): 3 confirmações para validar um espaço
- **Validação de espaço público** (RN02): apenas espaços públicos podem ser cadastrados
- **Avaliação de conservação**: ótimo, necessita reparos ou somente com revitalização
- **Fórum por espaço**: discussões e relatos da comunidade
- **Eventos**: peladas esportivas e mutirões de revitalização
- **Login com Google** via Firebase Authentication
- **Notificações push** para mutirões próximos (via Back4App)

---

## Stack tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Estilo | Tailwind CSS 4 |
| Mapas | Leaflet + react-leaflet |
| Estado | Zustand com persist |
| Formulários | React Hook Form + Zod |
| Backend | Back4App (Parse Server) |
| Autenticação | Firebase (Google OAuth) |
| Mobile | Capacitor (Android APK / iOS IPA) |
| Testes | Vitest + happy-dom |

---

## Pré-requisitos

- Node.js 18+
- Android Studio (para gerar APK)
- Conta no [Back4App](https://www.back4app.com/) com as classes configuradas
- Projeto no [Firebase Console](https://console.firebase.google.com/) com Google Auth ativo

---

## Configuração

### 1. Clonar e instalar

```bash
git clone https://github.com/brunomazzei/mapplay.git
cd mapplay
npm install
```

### 2. Variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

```env
# Back4App
VITE_PARSE_APP_ID=seu_app_id
VITE_PARSE_JS_KEY=seu_js_key

# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_VAPID_KEY=...
```

### 3. Cloud Code (Back4App)

Cole o conteúdo de `cloud-code/main.js` no painel do Back4App em **Cloud Code → main.js** e clique em **Deploy**.

---

## Executando o projeto

```bash
# Desenvolvimento (browser)
npm run dev

# Testes
npm test

# Build para produção
npm run build

# Exportar para Android
npm run build
npx cap sync android
npx cap open android
```

Consulte [`docs/comandos-build-run.md`](docs/comandos-build-run.md) para o guia completo.

---

## Estrutura de pastas

```
src/
├── views/mapplay/       # Telas do app (MapView, SpaceRegister, SpaceDetail…)
├── services/parse/      # Integração com Back4App (espacoService, authService…)
├── services/firebase/   # Google OAuth
├── store/               # Estado global (Zustand)
├── types/               # Tipos TypeScript do domínio
├── tests/               # Suite de testes Vitest
└── utils/hooks/         # Hooks customizados (useGeolocation…)

cloud-code/
└── main.js              # Cloud Code Back4App (consenso RN01, validação RN02, push)

docs/
├── escopo-projeto-mapplay.md
├── regras-de-negocio.md
├── roadmap-desenvolvimento.md
├── guia-back4app.md
└── comandos-build-run.md
```

---

## Regras de negócio

| Código | Regra |
|--------|-------|
| RN01 | Consenso democrático: 3 registros independentes no raio de 50m validam um espaço |
| RN02 | Apenas espaços públicos podem ser cadastrados |
| RN03 | Usuário deve estar autenticado para avaliar, postar no fórum e criar eventos |
| RN04 | Cada modalidade tem atributos específicos (cesta, gramado, obstáculo) |
| RN05 | Criador de mutirão assume responsabilidade pela organização |

---

## Desenvolvido por

Bruno Mazzei — ADS 5° Semestre  
Projeto Integrador — 2025
