# MapPlay — Comandos de Build e Execução

## Pré-requisitos

- Node.js 18+ instalado
- Android Studio instalado (para gerar APK)
- Arquivo `.env` na raiz do projeto com as credenciais (copie `.env.example`)

---

## 1. Instalar dependências

Rode uma vez após clonar ou sempre que o `package.json` mudar:

```bash
npm install
```

---

## 2. Rodar em modo desenvolvimento (browser)

```bash
npm run dev
```

Abre em `http://localhost:5173`. Hot reload ativo — qualquer alteração no código reflete instantaneamente.

---

## 3. Rodar os testes

```bash
# Roda todos os testes uma vez e exibe o resultado
npm test

# Modo watch — re-executa ao salvar arquivos (ideal durante desenvolvimento)
npm run test:watch

# Com relatório de cobertura em /coverage
npm run test:coverage
```

---

## 4. Build para produção (web)

Gera os arquivos otimizados na pasta `/build`:

```bash
npm run build
```

Para visualizar o build localmente antes de exportar:

```bash
npm run preview
```

---

## 5. Exportar para Android (APK)

Execute os passos na ordem:

```bash
# 1. Gera o build de produção
npm run build

# 2. Copia o build para o projeto Android e atualiza plugins
npx cap sync android

# 3. Abre o Android Studio para gerar o APK
npx cap open android
```

No Android Studio:
- Aguarde a indexação do Gradle terminar
- Menu **Build → Build Bundle(s) / APK(s) → Build APK(s)**
- O APK fica em `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 6. Instalar o APK diretamente no celular (via USB)

Com o celular conectado via USB e depuração USB ativada:

```bash
# Verifica se o dispositivo está reconhecido
adb devices

# Instala o APK no dispositivo
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 7. Atualizar o Cloud Code no Back4App

Sempre que `cloud-code/main.js` for alterado, acesse:

**Back4App Dashboard → Cloud Code → main.js** → cole o conteúdo do arquivo e clique em **Deploy**.

---

## Fluxo completo de uma alteração

```bash
# 1. Faz as alterações no código

# 2. Roda os testes para garantir que nada quebrou
npm test

# 3. Gera o build
npm run build

# 4. Sincroniza com o Android
npx cap sync android

# 5. Abre o Android Studio e gera o APK
npx cap open android
```
