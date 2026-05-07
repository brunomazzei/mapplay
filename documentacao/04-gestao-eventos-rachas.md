# DOCUMENTO DE ESPECIFICAÇÃO FUNCIONAL (DEF) – Gestão de Eventos e Rachas

| Campo | Valor |
|-------|--------|
| **Identificação do Projeto** | [NOME DO SISTEMA] |
| **Módulo/Funcionalidade** | Gestão de Eventos e Rachas (Partidas Abertas) |
| **Versão Documental** | 1.0 |
| **Data da Última Atualização** | [DATA] |

---

## 1. INTRODUÇÃO

### 1.1 Propósito
Este documento descreve as especificações funcionais e as regras de negócio do módulo de **Gestão de Eventos e Rachas**, que permite criar partidas abertas ("rachas") com sistema de confirmação e convites, facilitando a conexão entre jogadores e o uso dos espaços públicos.

### 1.2 Escopo
- **Faz:** Criar partida/racha (data, hora, quadra, esporte, vagas, descrição); listar partidas abertas e minhas partidas; exibir detalhes da partida com lista de confirmados; confirmar presença em partida; convidar outros usuários (link ou lista); visualizar partidas em calendário; cancelar ou editar partida (criador).
- **Não faz:** Pagamento ou cobrança pela partida; ranking oficial de jogadores; arbitragem; integração com calendário externo (Google Calendar, etc.) no MVP.

---

## 2. REQUISITOS FUNCIONAIS (RF)

| ID | Título | Descrição | Prioridade |
|----|--------|-----------|------------|
| RF01 | Criar partida | O sistema deve permitir que usuário autenticado crie uma partida/racha informando quadra, data, hora, esporte, número de vagas e descrição (opcional). | Alta |
| RF02 | Listar partidas abertas | O sistema deve exibir listagem de partidas abertas com filtros (data, quadra, esporte) e indicador de vagas disponíveis. | Alta |
| RF03 | Detalhes da partida | O sistema deve exibir detalhes da partida (organizador, quadra, data/hora, vagas, confirmados) e permitir "Participar" (confirmar presença). | Alta |
| RF04 | Confirmar presença | O sistema deve permitir que usuário autenticado confirme presença em partida aberta, respeitando o limite de vagas. | Alta |
| RF05 | Cancelar presença | O sistema deve permitir que o usuário cancele sua confirmação em uma partida, liberando a vaga. | Moderada |
| RF06 | Convites | O sistema deve permitir compartilhar link da partida ou enviar convite para outros usuários (ex.: por link ou lista de contatos do app). | Moderada |
| RF07 | Minhas partidas | O sistema deve exibir "Minhas partidas" (criadas por mim e nas quais confirmei presença) em lista e/ou calendário. | Alta |
| RF08 | Editar/Cancelar partida | O sistema deve permitir que o criador edite (data, vagas, descrição) ou cancele a partida; cancelamento deve notificar ou refletir para os confirmados. | Moderada |
| RF09 | Calendário | O sistema deve exibir partidas em visão de calendário (dia/semana), reutilizando ou adaptando o componente de calendário existente. | Moderada |

---

## 3. REQUISITOS NÃO FUNCIONAIS (RNF)

| ID | Título | Descrição | Prioridade |
|----|--------|-----------|------------|
| RNF01 | Vagas | O sistema não deve permitir confirmações além do número de vagas definido. | Alta |
| RNF02 | Consistência | Lista de confirmados e contagem de vagas ocupadas devem estar sempre consistentes. | Alta |
| RNF03 | Usabilidade | Criação e confirmação devem ser rápidas e claras; link de convite deve ser copiável e utilizável sem login prévio (com redirecionamento para login e depois para a partida). | Alta |
| RNF04 | Responsividade | Telas de listagem, detalhe e formulário devem funcionar em mobile. | Alta |

---

## 4. REGRAS DE NEGÓCIO (RN)

- **[RN.01] Usuário autenticado:** Apenas usuário autenticado pode criar partida, confirmar presença ou cancelar confirmação.
- **[RN.02] Vagas:** O número de confirmados não pode ultrapassar o número de vagas da partida; ao atingir o limite, o botão "Participar" deve ser desabilitado ou exibir "Lotado".
- **[RN.03] Uma confirmação por usuário:** Cada usuário pode confirmar presença apenas uma vez por partida; não pode constar duplicado na lista de confirmados.
- **[RN.04] Criador:** O criador da partida pode editar e cancelar a partida; pode ser considerado automaticamente como um dos confirmados ou não (definir no produto).
- **[RN.05] Data/hora futura:** A partida deve ter data e hora futuras no momento da criação; o sistema pode ocultar ou marcar como encerradas partidas já realizadas.
- **[RN.06] Quadra vinculada:** A partida deve estar vinculada a uma quadra/pista cadastrada no sistema (lista ou mapa).
- **[RN.07] Cancelamento de partida:** Ao cancelar a partida, o sistema deve atualizar o estado para "Cancelada" e a lista de confirmados deve refletir que a partida não ocorrerá (opcional: notificação aos confirmados).

---

## 5. FLUXO DE EVENTOS (CASO DE USO)

### 5.1 Cenário principal – Criar partida (caminho feliz)
1. O usuário autenticado acessa "Criar partida" (menu ou botão).
2. O sistema exibe formulário: quadra (select/listagem), data, hora, esporte, número de vagas, descrição (opcional).
3. O usuário preenche e submete.
4. O sistema valida conforme RN.01, RN.05, RN.06 e persiste a partida.
5. O sistema exibe mensagem de sucesso, opção de copiar link de convite e redireciona para a partida ou para "Minhas partidas".

### 5.2 Cenário principal – Confirmar presença (caminho feliz)
1. O usuário acessa a listagem de partidas abertas ou recebe link de convite.
2. O sistema exibe a partida com detalhes e botão "Participar" (se houver vaga).
3. O usuário clica em "Participar"; se não estiver logado, o sistema redireciona para login e depois de volta para a partida.
4. O sistema valida RN.02 e RN.03 e adiciona o usuário à lista de confirmados.
5. O sistema exibe confirmação e atualiza a contagem de vagas; o usuário passa a ver a partida em "Minhas partidas".

### 5.3 Fluxos de exceção / alternativos
- **[E01] Vagas esgotadas:** Se o usuário tentar confirmar e as vagas estiverem esgotadas (RN.02), o sistema deve exibir "Partida lotada" e não adicionar o usuário.
- **[E02] Já confirmado:** Se o usuário já estiver na lista de confirmados (RN.03), o sistema deve exibir "Você já está nesta partida" e não duplicar.
- **[E03] Dados inválidos:** Se data/hora ou quadra forem inválidos (RN.05, RN.06), o sistema deve destacar os campos e exibir mensagens de erro.
- **[E04] Partida cancelada:** Se o criador cancelar a partida, usuários que acessarem o link ou "Minhas partidas" devem ver o status "Cancelada".

---

## 6. CONCLUSÃO E VALIDAÇÃO

### 6.1 Histórico de Revisões

| Versão | Data | Autor | Alterações Realizadas |
|--------|------|-------|----------------------|
| 1.0 | [DD/MM/AAAA] | [Nome do Responsável] | Elaboração inicial do DEF. |

### 6.2 Considerações finais
- O template já possui **Calendário** com eventos e **EventDialog** (título, datas, cor); é possível **adaptar** para o conceito de partida (quadra, esporte, vagas, confirmados) e reutilizar a visão de calendário.
- Serviço de eventos hoje usa API mock; a persistência deve ser substituída por Firestore ou API real (partidas e subcoleção ou documento de confirmados).
- Dependências: módulo de Quadras/Pistas para vincular a partida à quadra; modelo de usuário para lista de confirmados e convites.
