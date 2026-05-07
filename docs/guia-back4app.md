# Guia de Configuração — Back4App

> Siga este guia para ativar o backend real do MapPlay, substituindo os dados mock pelo Back4App.

---

## 1. Criar conta e projeto

1. Acesse [back4app.com](https://back4app.com) e crie uma conta gratuita
2. Crie um novo projeto: **"MapPlay"**
3. No painel do projeto, vá em **App Settings > Security & Keys**
4. Copie o **Application ID** e o **JavaScript Key**

---

## 2. Criar o arquivo `.env`

Na raiz do projeto (mesma pasta do `package.json`), crie o arquivo `.env`:

```env
VITE_PARSE_APP_ID=cole_aqui_o_application_id
VITE_PARSE_JS_KEY=cole_aqui_o_javascript_key

VITE_FIREBASE_API_KEY=sua_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_firebase_app_id
```

> ⚠️ O `.env` está no `.gitignore` — nunca commite credenciais.

---

## 3. Criar as classes no Back4App Dashboard

Vá em **Database > Browser** e crie as seguintes classes:

### Classe: `Espaco`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | String | Nome do espaço |
| `modalidade` | String | `basquete` / `futebol` / `skate` |
| `localizacao` | GeoPoint | Coordenadas GPS |
| `status` | String | `validado` / `pendente` |
| `confirmacoes` | Number | Contagem de confirmações |
| `avaliacao` | String | Avaliação predominante atual |
| `iluminacao` | Boolean | Tem iluminação noturna |
| `atributos` | Object | Dados específicos da modalidade |
| `bairro` | String | Bairro do espaço |
| `cidade` | String | Cidade do espaço |
| `endereco` | String | Endereço completo (opcional) |
| `fotos` | Array | URLs das fotos |
| `criadoEm` | String | Data de criação (YYYY-MM-DD) |

### Classe: `RegistroEspaco`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | String | Nome informado pelo usuário |
| `modalidade` | String | Modalidade esportiva |
| `localizacao` | GeoPoint | Coordenadas GPS (RN03) |
| `isPublico` | Boolean | Confirmação espaço público (RN02) |
| `iluminacao` | Boolean | Tem iluminação |
| `atributos` | Object | Atributos da modalidade (RN04) |
| `bairro` | String | Bairro |
| `cidade` | String | Cidade |
| `autor` | Pointer<_User> | Usuário que registrou |

### Classe: `Avaliacao`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `espaco` | Pointer<Espaco> | Espaço avaliado |
| `nivel` | String | `otimo` / `necessita_reparos` / `somente_revitalizacao` |
| `fotoUrl` | String | URL da foto comprovante (opcional) |
| `autor` | Pointer<_User> | Usuário que avaliou |

### Classe: `Evento`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `espaco` | Pointer<Espaco> | Espaço do evento |
| `tipo` | String | `esportivo` / `mutirao` |
| `nome` | String | Nome do evento |
| `modalidade` | String | Modalidade (opcional, para esportivos) |
| `data` | String | Data no formato YYYY-MM-DD |
| `hora` | String | Hora no formato HH:mm |
| `vagas` | Number | Total de vagas |
| `vagasRestantes` | Number | Vagas disponíveis |
| `descricao` | String | Descrição do evento |
| `participantesIds` | Array | IDs dos participantes |
| `criador` | Pointer<_User> | Usuário criador |

### Classe: `PostForum`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `espaco` | Pointer<Espaco> | Espaço do post |
| `conteudo` | String | Conteúdo da publicação |
| `tipo` | String | `discussao` / `mobilizacao` |
| `autorNome` | String | Nome do autor (cache) |
| `autor` | Pointer<_User> | Usuário autor |
| `curtidasIds` | Array | IDs de usuários que curtiram |

### Campos adicionais em `_User`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | String | Nome completo |
| `bairro` | String | Bairro do usuário |
| `cidade` | String | Cidade do usuário |
| `esportes` | Array | Esportes praticados |
| `authority` | Array | `['user']` ou `['admin']` |
| `avatarUrl` | String | URL do avatar |

---

## 4. Deploy do Cloud Code

1. No painel do Back4App, vá em **Cloud Code > Functions**
2. Copie o conteúdo de `cloud-code/main.js` e cole no editor
3. Clique em **Deploy**

O Cloud Code implementa:
- **RN01**: Trigger `afterSave` em `RegistroEspaco` → consenso democrático (3 confirmações)
- **RN02**: Trigger `beforeSave` → valida que o espaço é público
- **Push**: `afterSave` em `Evento` → notifica usuários próximos de mutirões

---

## 5. LiveQuery (opcional — requer plano pago no Back4App)

> ⚠️ O LiveQuery exige cartão de crédito cadastrado e liberação manual pelo Back4App.
> **O app funciona perfeitamente sem ele** usando polling automático a cada 30 segundos.

Se quiser ativar:
1. No painel, vá em **Server Settings > Server URL**
2. Em **LiveQuery**, ative e adicione as classes: `Espaco`, `PostForum`
3. Copie o **LiveQuery URL** (formato `wss://...`)
4. No `ParseConfig.ts`, adicione: `Parse.liveQueryServerURL = 'wss://SEU_APP_ID.b4a.io'`
5. Em `DataLoader.tsx`, mude `POLL_INTERVAL_MS` para `0` e descomente o código de LiveQuery

**Sem LiveQuery:** o `DataLoader` faz polling a cada 30s — suficiente para uma demo acadêmica.
Novos espaços cadastrados por outros usuários aparecem no mapa do seu dispositivo em até 30s.

---

## 6. Configurar Push Notifications (Android)

1. No Firebase Console, crie/use o projeto do Google OAuth
2. Vá em **Project Settings > Cloud Messaging** e copie a **Server Key**
3. No Back4App, vá em **Push Notifications > Android** e cole a Server Key
4. No app, os tokens de instalação são enviados via `@capacitor/push-notifications`

---

## 7. Desativar o mock e ativar o Back4App

Edite `src/configs/app.config.ts`:

```ts
const appConfig: AppConfig = {
    // ...
    enableMock: false,  // ← mude de true para false
}
```

A partir desse momento:
- `AuthProvider` usa `Parse.User.logIn()` / `Parse.User.signUp()`
- `DataLoader` carrega dados reais ao iniciar o app
- `LiveQuery` sincroniza o mapa em tempo real
- Todas as escritas (espaços, eventos, posts) vão direto ao Back4App

---

## 8. Verificar

Após configurar, teste:
- [ ] Criar conta no app → usuário aparece em `_User` no Back4App Dashboard
- [ ] Cadastrar espaço → `RegistroEspaco` criado, Cloud Code dispara
- [ ] Com 3 registros no mesmo local → espaço muda para `validado`
- [ ] Criar evento de mutirão → push enviado para usuários próximos
- [ ] Avaliar espaço → `Avaliacao` criada e `Espaco.avaliacao` atualizado

---

## Referências

- [[decisoes-tecnicas]] — Por que Back4App
- [[regras-de-negocio]] — RN01–RN06
- [[roadmap-desenvolvimento]] — Fase 7 concluída
