# DOCUMENTO DE ESPECIFICAÇÃO FUNCIONAL (DEF) – Cadastro e Listagem de Locais

| Campo | Valor |
|-------|--------|
| **Identificação do Projeto** | [NOME DO SISTEMA] |
| **Módulo/Funcionalidade** | Cadastro e Listagem de Locais (Quadras e Pistas) |
| **Versão Documental** | 1.0 |
| **Data da Última Atualização** | [DATA] |

---

## 1. INTRODUÇÃO

### 1.1 Propósito
Este documento descreve as especificações funcionais e as regras de negócio do módulo de **Cadastro e Listagem de Locais**, que permite listar os espaços públicos (quadras e pistas) cadastrados e cadastrar novos locais com dados básicos. Esta funcionalidade é a base mínima para gestão dos espaços, **sem integração com mapa** na versão inicial.

### 1.2 Escopo
- **Faz:** Listar locais (quadras/pistas) em tela com dados básicos; cadastrar novo local com campos obrigatórios e opcionais definidos; visualizar detalhes de um local; editar e, se aplicável, inativar/excluir local (conforme regras); filtrar ou buscar na listagem (por nome, tipo, endereço).
- **Não faz (nesta versão):** Exibir locais em mapa interativo; geolocalização ou coordenadas; upload de múltiplas fotos (pode ser incluído como mínimo uma foto ou deixar para fase seguinte); status em tempo real (lotação/condições); gestão de eventos/rachas vinculados ao local (módulo próprio).

---

## 2. REQUISITOS FUNCIONAIS (RF)

| ID | Título | Descrição | Prioridade |
|----|--------|-----------|------------|
| RF01 | Listar locais | O sistema deve exibir uma listagem de quadras e pistas cadastradas, com informações mínimas (nome, tipo, endereço e, se houver, indicador de status ou última atualização). | Alta |
| RF02 | Cadastrar local | O sistema deve permitir que usuário autenticado cadastre um novo local (quadra ou pista) preenchendo os campos obrigatórios definidos nas regras de negócio. | Alta |
| RF03 | Visualizar detalhes | O sistema deve permitir visualizar todos os dados de um local ao clicar em um item da listagem ou em "Ver detalhes". | Alta |
| RF04 | Editar local | O sistema deve permitir que o criador ou perfil autorizado edite os dados de um local já cadastrado. | Alta |
| RF05 | Buscar/filtrar | O sistema deve permitir buscar locais por nome e filtrar por tipo (quadra/pista) e, se aplicável, por cidade ou bairro. | Moderada |
| RF06 | Ordenação | A listagem deve permitir ordenar por nome, data de cadastro ou outro critério definido (ex.: mais recentes primeiro). | Baixa |
| RF07 | Foto do local (mínimo) | O sistema deve permitir anexar ao menos uma foto ao cadastro do local (opcional no MVP: pode ser fase 2). | Moderada |

---

## 3. REQUISITOS NÃO FUNCIONAIS (RNF)

| ID | Título | Descrição | Prioridade |
|----|--------|-----------|------------|
| RNF01 | Performance | A listagem deve carregar em tempo aceitável; recomenda-se paginação ou limite de itens por página se a base crescer. | Alta |
| RNF02 | Validação | Os formulários de cadastro e edição devem validar os campos obrigatórios antes de enviar; exibir mensagens claras de erro. | Alta |
| RNF03 | Responsividade | As telas de listagem, cadastro e detalhes devem ser utilizáveis em dispositivos móveis. | Alta |
| RNF04 | Consistência | Os dados exibidos na listagem e na tela de detalhes devem ser consistentes com o que foi persistido. | Alta |

---

## 4. REGRAS DE NEGÓCIO (RN)

- **[RN.01] Usuário autenticado:** Apenas usuário autenticado pode cadastrar ou editar local; a listagem e a visualização de detalhes podem ser públicas ou restritas (definir no produto).
- **[RN.02] Campos obrigatórios no cadastro:** São obrigatórios: **nome**, **tipo** (quadra ou pista) e **endereço** (logradouro, número, bairro, cidade, CEP ou mínimo definido). Complemento e referência são opcionais.
- **[RN.03] Tipo do local:** O tipo deve ser um valor fixo da lista: Quadra ou Pista (ou outros tipos predefinidos, sem texto livre).
- **[RN.04] Unicidade:** O sistema pode validar ou alertar para evitar cadastro duplicado (ex.: mesmo nome e mesmo endereço); regra exata a definir (ex.: permitir mesmo nome em endereços diferentes).
- **[RN.05] Edição e exclusão:** Apenas o usuário que criou o registro ou perfil com permissão de administrador pode editar ou excluir/inativar o local.
- **[RN.06] Exclusão:** Preferencialmente o sistema deve **inativar** o local em vez de excluir fisicamente, para preservar vínculos (eventos, denúncias). Se houver exclusão, definir o que ocorre com os vínculos.
- **[RN.07] Foto (se implementada):** Formato e tamanho máximo de arquivo devem seguir política definida (ex.: JPEG/PNG, máx. 5MB); uma foto pode ser obrigatória ou opcional no MVP.

---

## 5. FLUXO DE EVENTOS (CASO DE USO)

### 5.1 Cenário principal – Listar locais (caminho feliz)
1. O usuário acessa a tela "Locais" (ou "Quadras e Pistas").
2. O sistema exibe a listagem de locais com colunas definidas (ex.: nome, tipo, endereço, ações).
3. O usuário pode usar busca por nome e filtro por tipo; a lista é atualizada conforme os critérios.
4. O usuário clica em um item (ou em "Ver detalhes").
5. O sistema exibe a tela de detalhes do local com todos os dados cadastrados.

### 5.2 Cenário principal – Cadastrar local (caminho feliz)
1. O usuário autenticado acessa "Cadastrar local" (botão na listagem ou no menu).
2. O sistema exibe o formulário com os campos: nome, tipo (quadra/pista), endereço (logradouro, número, bairro, cidade, CEP), complemento e referência (opcionais) e, se aplicável, uma foto.
3. O usuário preenche os campos obrigatórios e opcionais e submete o formulário.
4. O sistema valida conforme RN.01 a RN.07.
5. O sistema persiste o local, exibe mensagem de sucesso e redireciona para a listagem ou para a tela de detalhes do local cadastrado.

### 5.3 Cenário principal – Editar local (caminho feliz)
1. O usuário autenticado (criador ou admin) acessa a tela de detalhes do local e clica em "Editar".
2. O sistema exibe o formulário preenchido com os dados atuais do local.
3. O usuário altera os campos desejados e submete.
4. O sistema valida e persiste as alterações.
5. O sistema exibe mensagem de sucesso e atualiza a tela de detalhes ou redireciona para a listagem.

### 5.4 Fluxos de exceção / alternativos
- **[E01] Campos obrigatórios em branco:** Se nome, tipo ou endereço estiverem em branco ou inválidos (RN.02), o sistema deve destacar o(s) campo(s) e exibir mensagem de erro específica.
- **[E02] Tipo inválido:** O tipo deve ser escolhido na lista (RN.03); não deve ser possível enviar valor fora da lista.
- **[E03] Sem permissão para editar:** Se usuário sem permissão tentar editar (RN.05), o sistema deve ocultar o botão "Editar" ou exibir mensagem de não autorizado.
- **[E04] Falha ao salvar:** Em caso de falha de conexão ou servidor ao cadastrar/editar, o sistema deve exibir mensagem de erro e permitir nova tentativa sem perder os dados preenchidos (quando possível).
- **[E05] Duplicidade (se RN.04 for aplicada):** Se o sistema detectar possível duplicidade (nome + endereço), deve exibir alerta e permitir que o usuário confirme ou corrija antes de salvar.

---

## 6. FUNCIONALIDADES MÍNIMAS PARA ENTREGA

Para a entrega inicial (MVP) desta funcionalidade, o seguinte **mínimo** deve estar implementado e funcionando:

| Item | Descrição | Obrigatório |
|------|-----------|-------------|
| **Listagem** | Tela que exibe os locais em tabela ou lista, com pelo menos: nome, tipo, endereço. | Sim |
| **Cadastro** | Formulário com campos obrigatórios: nome, tipo (quadra/pista), endereço (mínimo: logradouro, número, bairro, cidade). | Sim |
| **Validação** | Validação dos campos obrigatórios antes de enviar; mensagem de erro em caso de falha. | Sim |
| **Persistência** | Dados salvos em banco (Firestore ou API) e exibidos corretamente na listagem após cadastro. | Sim |
| **Detalhes** | Tela ou drawer com todos os dados do local ao clicar em um item da listagem. | Sim |
| **Edição** | Possibilidade de editar um local já cadastrado (para usuário criador ou admin). | Sim |
| **Busca/Filtro** | Busca por nome e filtro por tipo (quadra/pista). | Desejável |
| **Foto** | Uma foto por local no cadastro/edição (pode ser opcional ou fase 2). | Desejável |

---

## 7. CONCLUSÃO E VALIDAÇÃO

### 7.1 Histórico de Revisões

| Versão | Data | Autor | Alterações Realizadas |
|--------|------|-------|----------------------|
| 1.0 | [DD/MM/AAAA] | [Nome do Responsável] | Elaboração inicial do DEF. |

### 7.2 Considerações finais
- Esta funcionalidade é **pré-requisito** para o Mapa Interativo: os mesmos locais poderão ser exibidos no mapa em versão futura, com inclusão de coordenadas e fotos adicionais.
- O template do projeto já oferece: padrão de **listagem com tabela** (ex.: CustomerList, ProductList), **formulários** com validação (react-hook-form + Zod), **telas de detalhes e edição** e componente de **Upload**; todos podem ser reutilizados para implementar este módulo.
- Dependências: Firestore ou API para persistência; definição de permissões (quem pode cadastrar/editar) e de listagem pública ou restrita a usuários logados.
