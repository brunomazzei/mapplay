import Parse from 'parse';

Parse.initialize(
  import.meta.env.VITE_PARSE_APP_ID,
  import.meta.env.VITE_PARSE_JS_KEY
);

Parse.serverURL = 'https://parseapi.back4app.com/';

export default Parse;
