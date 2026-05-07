# DOCUMENTO DE ESPECIFICAÇÃO FUNCIONAL (DEF) – Avaliação e Zeladoria

| Campo | Valor |
|-------|--------|
| **Identificação do Projeto** | [NOME DO SISTEMA] |
| **Módulo/Funcionalidade** | Avaliação e Zeladoria (Denúncias e Mutirões) |
| **Versão Documental** | 1.0 |
| **Data da Última Atualização** | [DATA] |

---

## 1. INTRODUÇÃO

### 1.1 Propósito
Este documento descreve as especificações funcionais e as regras de negócio do módulo de **Avaliação e Zeladoria**, que permite denunciar problemas nos espaços públicos e organizar mutirões de limpeza ou manutenção, promovendo a zeladoria comunitária.

### 1.2 Escopo
- **Faz:** Registrar denúncia de problema (quadra/pista, tipo, descrição, fotos); listar denúncias (abertas/resolvidas, por espaço ou geral); criar mutirão (quadra, data, descrição); listar mutirões e detalhes; confirmar participação em mutirão; exibir denúncias e mutirões no contexto do espaço (detalhe da quadra).
- **Não faz:** Tramitação formal para órgão público; garantia de resolução pelo poder público; gamificação ou pontos por participação no MVP; notificação push obrigatória.

---

## 2. REQUISITOS FUNCIONAIS (RF)

### 2.1 Denúncias

| ID | Título | Descrição | Prioridade |
|----|--------|-----------|------------|
| RF01 | Registrar denúncia | O sistema deve permitir que usuário autenticado registre denúncia vinculada a uma quadra/pista, com tipo de problema (ex.: iluminação, piso, rede, sujeira), descrição e fotos (opcional). | Alta |
| RF02 | Listar denúncias | O sistema deve exibir listagem de denúncias com filtros (espaço, tipo, status aberta/resolvida) e ordenação (data). | Alta |
| RF03 | Detalhes da denúncia | O sistema deve exibir detalhes da denúncia (autor, espaço, tipo, descrição, fotos, data, status). | Alta |
| RF04 | Denúncias no espaço | Na tela de detalhes da quadra/pista, o sistema deve exibir as denúncias relacionadas àquele espaço. | Moderada |
| RF05 | Status da denúncia | O sistema deve permitir alterar status da denúncia (ex.: aberta → em análise → resolvida), por criador ou por perfil com permissão. | Moderada |

### 2.2 Mutirões

| ID | Título | Descrição | Prioridade |
|----|--------|-----------|------------|
| RF06 | Criar mutirão | O sistema deve permitir que usuário autenticado crie mutirão vinculado a uma quadra/pista, com data, horário, descrição e número de vagas (opcional). | Alta |
| RF07 | Listar mutirões | O sistema deve exibir listagem de mutirões (próximos, por espaço) com data e participantes. | Alta |
| RF08 | Detalhes do mutirão | O sistema deve exibir detalhes do mutirão (organizador, espaço, data, descrição, lista de participantes) e permitir "Participar". | Alta |
| RF09 | Participar do mutirão | O sistema deve permitir que usuário autenticado confirme participação em mutirão; opcionalmente limitar por vagas. | Alta |
| RF10 | Mutirões no espaço | Na tela de detalhes da quadra/pista, o sistema deve exibir os mutirões relacionados àquele espaço. | Moderada |

---

## 3. REQUISITOS NÃO FUNCIONAIS (RNF)

| ID | Título | Descrição | Prioridade |
|----|--------|-----------|------------|
| RNF01 | Fotos nas denúncias | Fotos devem ser armazenadas de forma segura e exibidas com tamanho adequado; formato e tamanho máximo definidos (ex.: JPEG/PNG, 5MB). | Alta |
| RNF02 | Consistência | Denúncias e mutirões devem estar corretamente vinculados ao espaço (quadra/pista); listagens devem refletir filtros e ordenação. | Alta |
| RNF03 | Usabilidade | Formulários de denúncia e mutirão devem ser objetivos; lista de denúncias deve permitir identificar rapidamente tipo e status. | Alta |
| RNF04 | Responsividade | Telas de listagem, detalhe e formulários devem funcionar em dispositivos móveis. | Alta |

---

## 4. REGRAS DE NEGÓCIO (RN)

### Denúncias
- **[RN.01] Usuário autenticado:** Apenas usuário autenticado pode registrar denúncia.
- **[RN.02] Campos obrigatórios:** Denúncia deve ter: espaço (quadra/pista), tipo de problema e descrição; fotos são opcionais mas recomendadas.
- **[RN.03] Vinculação ao espaço:** Toda denúncia deve estar vinculada a um espaço cadastrado no sistema.
- **[RN.04] Status:** Denúncia pode ter status inicial "Aberta"; transição para "Resolvida" (ou "Em análise") pode ser feita pelo criador ou por perfil com permissão (definir no produto).
- **[RN.05] Edição/Exclusão:** Apenas o criador (ou perfil autorizado) pode editar ou encerrar a denúncia.

### Mutirões
- **[RN.06] Usuário autenticado:** Apenas usuário autenticado pode criar mutirão ou confirmar participação.
- **[RN.07] Campos obrigatórios:** Mutirão deve ter: espaço, data, descrição; número de vagas é opcional.
- **[RN.08] Data futura:** A data do mutirão deve ser futura no momento da criação.
- **[RN.09] Uma participação por usuário:** Cada usuário pode constar apenas uma vez na lista de participantes do mutirão.
- **[RN.10] Vagas:** Se houver limite de vagas, o número de participantes não pode ultrapassar esse limite.
- **[RN.11] Organizador:** O criador do mutirão pode editar ou cancelar; cancelamento deve refletir para os participantes (ex.: status "Cancelado").

---

## 5. FLUXO DE EVENTOS (CASO DE USO)

### 5.1 Cenário principal – Registrar denúncia (caminho feliz)
1. O usuário autenticado acessa "Reportar problema" (menu ou na tela do espaço).
2. O sistema exibe formulário: espaço (select ou já preenchido se veio do detalhe da quadra), tipo de problema, descrição, fotos (opcional).
3. O usuário preenche e envia.
4. O sistema valida RN.01 a RN.03 e persiste a denúncia com status "Aberta".
5. O sistema exibe mensagem de sucesso e redireciona para a listagem de denúncias ou para o detalhe do espaço.

### 5.2 Cenário principal – Criar mutirão (caminho feliz)
1. O usuário autenticado acessa "Criar mutirão" (menu ou na tela do espaço).
2. O sistema exibe formulário: espaço, data, horário, descrição, vagas (opcional).
3. O usuário preenche e submete.
4. O sistema valida RN.06 a RN.08 e persiste o mutirão.
5. O sistema exibe mensagem de sucesso e redireciona para o mutirão ou para a listagem de mutirões.

### 5.3 Cenário principal – Participar de mutirão (caminho feliz)
1. O usuário acessa a listagem de mutirões ou o detalhe de um mutirão.
2. O sistema exibe o mutirão com botão "Participar" (se houver vaga, quando aplicável).
3. O usuário clica em "Participar".
4. O sistema valida RN.06, RN.09, RN.10 e adiciona o usuário à lista de participantes.
5. O sistema exibe confirmação e atualiza a lista de participantes.

### 5.4 Fluxos de exceção / alternativos
- **[E01] Dados inválidos:** Se tipo, espaço ou descrição estiverem em branco ou inválidos (RN.02, RN.07), o sistema deve destacar os campos e exibir mensagens de erro.
- **[E02] Data passada (mutirão):** Se a data do mutirão for passada (RN.08), o sistema deve rejeitar e exibir mensagem.
- **[E03] Mutirão lotado:** Se RN.10 for aplicada e as vagas estiverem esgotadas, o sistema deve exibir "Vagas esgotadas" e desabilitar "Participar".
- **[E04] Já participando:** Se RN.09 for violada (usuário já na lista), o sistema deve exibir "Você já está neste mutirão".

---

## 6. CONCLUSÃO E VALIDAÇÃO

### 6.1 Histórico de Revisões

| Versão | Data | Autor | Alterações Realizadas |
|--------|------|-------|----------------------|
| 1.0 | [DD/MM/AAAA] | [Nome do Responsável] | Elaboração inicial do DEF. |

### 6.2 Considerações finais
- Este módulo **não existe no template**; é necessário implementar telas de listagem e formulários de denúncia e mutirão, além da vinculação com o módulo de Quadras/Pistas.
- O template já oferece: componente de **Upload** para fotos das denúncias, **formulários** com validação (react-hook-form + Zod), padrão de **listagem com tabela** e de **detalhes**, que podem ser reutilizados. O padrão de "confirmar participação" é análogo ao de partidas (módulo Gestão de Eventos).
- Dependências: Firebase Storage ou similar para fotos das denúncias; Firestore ou API para denúncias e mutirões; módulo de Quadras/Pistas para vincular denúncia e mutirão ao espaço.
