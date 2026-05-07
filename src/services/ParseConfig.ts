import Parse from 'parse'

const APP_ID = import.meta.env.VITE_PARSE_APP_ID as string
const JS_KEY = import.meta.env.VITE_PARSE_JS_KEY as string

if (!APP_ID || !JS_KEY) {
    console.error(
        '[MapPlay] Credenciais do Back4App não encontradas.\n' +
        'Crie o arquivo .env na raiz do projeto com:\n' +
        '  VITE_PARSE_APP_ID=seu_app_id\n' +
        '  VITE_PARSE_JS_KEY=seu_js_key\n' +
        'Consulte docs/guia-back4app.md para instruções completas.',
    )
}

Parse.initialize(APP_ID, JS_KEY)
Parse.serverURL = 'https://parseapi.back4app.com/'

export default Parse
