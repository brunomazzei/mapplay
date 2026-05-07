# DOCUMENTO DE ESPECIFICAÇÃO FUNCIONAL (DEF) – Autenticação

| Campo | Valor |
|-------|--------|
| **Identificação do Projeto** | [NOME DO SISTEMA] |
| **Módulo/Funcionalidade** | Autenticação (Login, Cadastro, Recuperação de Senha) |
| **Versão Documental** | 1.0 |
| **Data da Última Atualização** | [DATA] |

---

## 1. INTRODUÇÃO

### 1.1 Propósito
Este documento descreve as especificações funcionais e as regras de negócio do módulo de **Autenticação**, responsável por permitir que o usuário entre no sistema, crie conta e recupere o acesso quando necessário.

### 1.2 Escopo
- **Faz:** Login com e-mail e senha; cadastro de novo usuário; recuperação de senha (solicitação e redefinição); verificação por OTP quando aplicável; login via OAuth (ex.: Google) quando configurado; controle de sessão e rotas protegidas; persistência de token (localStorage/sessionStorage).
- **Não faz:** Autenticação biométrica; login com redes sociais além das integradas (ex.: apenas Google); gestão avançada de perfis/roles; 2FA além de OTP.

---

## 2. REQUISITOS FUNCIONAIS (RF)

| ID | Título | Descrição | Prioridade |
|----|--------|-----------|------------|
| RF01 | Login | O sistema deve permitir login com e-mail e senha. | Alta |
| RF02 | Cadastro | O sistema deve permitir cadastro de novo usuário com e-mail e senha. | Alta |
| RF03 | Esqueci a senha | O sistema deve permitir solicitar redefinição de senha por e-mail. | Moderada |
| RF04 | Redefinir senha | O sistema deve permitir redefinir a senha mediante link ou token válido. | Moderada |
| RF05 | Verificação OTP | O sistema deve permitir verificação por código OTP quando aplicável. | Baixa |
| RF06 | Login OAuth | O sistema deve permitir login via provedor OAuth (ex.: Google) se configurado. | Moderada |
| RF07 | Sessão | O sistema deve manter sessão do usuário e redirecionar para a tela inicial após login. | Alta |
| RF08 | Logout | O sistema deve permitir encerrar a sessão (logout). | Alta |

---

## 3. REQUISITOS NÃO FUNCIONAIS (RNF)

| ID | Título | Descrição | Prioridade |
|----|--------|-----------|------------|
| RNF01 | Persistência | O token de acesso deve ser persistido conforme configuração (ex.: localStorage). | Alta |
| RNF02 | Validação | Campos de formulário devem ser validados antes do envio. | Alta |
| RNF03 | Feedback | O sistema deve exibir mensagens de erro e sucesso nas operações de auth. | Alta |
| RNF04 | Rotas protegidas | Acesso a telas internas deve exigir usuário autenticado. | Alta |
| RNF05 | Segurança | Senhas não devem ser exibidas em texto claro; uso de HTTPS em produção. | Alta |

---

## 4. REGRAS DE NEGÓCIO (RN)

- **[RN.01] E-mail obrigatório:** O campo e-mail é obrigatório e deve estar em formato válido nos fluxos de login e cadastro.
- **[RN.02] Senha obrigatória:** O campo senha é obrigatório no login e no cadastro, respeitando política mínima (ex.: quantidade mínima de caracteres).
- **[RN.03] Unicidade de e-mail:** No cadastro, o sistema não deve permitir e-mail já cadastrado (quando a persistência estiver implementada).
- **[RN.04] Redirecionamento pós-login:** Após login bem-sucedido, o sistema deve redirecionar para a URL de destino configurada ou para a tela inicial padrão.
- **[RN.05] Redirecionamento sem sessão:** Usuário não autenticado que acessar rota protegida deve ser redirecionado para a tela de login.
- **[RN.06] Logout:** Ao encerrar sessão, o sistema deve invalidar o token e redirecionar para a tela de login ou landing.

---

## 5. FLUXO DE EVENTOS (CASO DE USO)

### 5.1 Cenário principal – Login (caminho feliz)
1. O usuário acessa a tela de Login.
2. O sistema exibe os campos E-mail e Senha e o link "Esqueci a senha".
3. O usuário preenche e-mail e senha e clica em "Sign in" (ou equivalente).
4. O sistema valida conforme RN.01 e RN.02.
5. O sistema autentica o usuário, persiste o token e redireciona para a tela inicial (RN.04).

### 5.2 Cenário principal – Cadastro (caminho feliz)
1. O usuário acessa a tela de Cadastro a partir do link na tela de Login.
2. O sistema exibe os campos necessários (ex.: nome, e-mail, senha, confirmação de senha).
3. O usuário preenche e clica em "Sign up" (ou equivalente).
4. O sistema valida os dados e verifica RN.03 quando aplicável.
5. O sistema persiste o usuário, realiza login e redireciona para a tela inicial.

### 5.3 Fluxos de exceção / alternativos
- **[E01] Dados inválidos:** Se a validação (RN.01/RN.02) falhar, o sistema deve destacar o(s) campo(s) em vermelho e exibir mensagem de erro específica.
- **[E02] Credenciais incorretas:** No login, em caso de falha na autenticação, o sistema deve exibir mensagem genérica (ex.: "Credenciais inválidas") sem revelar se o e-mail existe ou não.
- **[E03] Falha de conexão/serviço:** Em indisponibilidade do serviço de autenticação, o sistema deve exibir mensagem de erro e, quando aplicável, registrar log para suporte.
- **[E04] E-mail já cadastrado:** No cadastro, se RN.03 for violada, o sistema deve informar que o e-mail já está em uso e sugerir login ou recuperação de senha.

---

## 6. CONCLUSÃO E VALIDAÇÃO

### 6.1 Histórico de Revisões

| Versão | Data | Autor | Alterações Realizadas |
|--------|------|-------|----------------------|
| 1.0 | [DD/MM/AAAA] | [Nome do Responsável] | Elaboração inicial do DEF. |

### 6.2 Considerações finais
- O módulo de autenticação está **implementado no template** do projeto (telas de Login, Cadastro, Esqueci senha, Redefinir senha, OTP e fluxo OAuth).
- A persistência atual utiliza API REST (com mock); a integração com Firebase Auth está preparada e pode ser ativada conforme documentação do template.
- Recomenda-se revisar mensagens e rótulos para o domínio do produto (ex.: "Entrar", "Criar conta", "Recuperar senha") e configurar a URL de redirecionamento pós-login para a tela principal do sistema (ex.: Mapa ou Quadras).
