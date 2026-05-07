# DOCUMENTO DE ESPECIFICAÇÃO FUNCIONAL (DEF) – Status em Tempo Real

| Campo | Valor |
|-------|--------|
| **Identificação do Projeto** | [NOME DO SISTEMA] |
| **Módulo/Funcionalidade** | Status em Tempo Real (Lotação e Condições) |
| **Versão Documental** | 1.0 |
| **Data da Última Atualização** | [DATA] |

---

## 1. INTRODUÇÃO

### 1.1 Propósito
Este documento descreve as especificações funcionais e as regras de negócio do módulo de **Status em Tempo Real**, que permite sinalizar o nível de lotação e as condições da infraestrutura (aros, redes, piso) dos espaços públicos, com atualização em tempo real para apoiar a decisão do praticante.

### 1.2 Escopo
- **Faz:** Exibir indicadores de lotação (vazio, moderado, lotado) e de condições (aros, redes, piso) por quadra/pista; atualizar e exibir essas informações em tempo real (ou quasi tempo real); permitir que usuários informem/atualizem o status quando estiverem no local (opcional); exibir histórico ou última atualização (opcional).
- **Não faz:** Previsão de lotação por IA; sensores IoT automáticos; garantia de precisão absoluta do status (depende de atualizações da comunidade); notificações push automáticas por mudança de status.

---

## 2. REQUISITOS FUNCIONAIS (RF)

| ID | Título | Descrição | Prioridade |
|----|--------|-----------|------------|
| RF01 | Exibir lotação | O sistema deve exibir o nível de lotação (ex.: vazio, moderado, lotado) de cada quadra/pista na listagem e no detalhe. | Alta |
| RF02 | Exibir condições | O sistema deve exibir as condições da infraestrutura (aros, redes, piso) por espaço, quando informadas (ex.: bom, regular, ruim). | Alta |
| RF03 | Atualização em tempo real | O sistema deve atualizar os indicadores de lotação e condições em tempo real (ou com baixa latência) para todos os usuários visualizando o mesmo espaço. | Alta |
| RF04 | Informar status | O sistema deve permitir que usuário autenticado informe ou atualize o status (lotação e/ou condições) quando estiver no local ou tiver visitado recentemente. | Alta |
| RF05 | Última atualização | O sistema deve exibir data/hora da última atualização do status (ou "atualizado há X minutos") para dar contexto ao usuário. | Moderada |
| RF06 | Indicadores visuais | O sistema deve usar indicadores visuais claros (cores, ícones ou badges) para lotação e condições na listagem e no mapa. | Alta |

---

## 3. REQUISITOS NÃO FUNCIONAIS (RNF)

| ID | Título | Descrição | Prioridade |
|----|--------|-----------|------------|
| RNF01 | Latência | A atualização do status deve ser refletida para outros usuários em tempo aceitável (ex.: segundos a poucos minutos). | Alta |
| RNF02 | Consistência | O valor exibido deve refletir a última atualização persistida; evitar estados inconsistentes entre telas. | Alta |
| RNF03 | Disponibilidade | O mecanismo de tempo real (ex.: Firestore onSnapshot, WebSocket) deve ser resiliente a quedas e reconexões. | Moderada |
| RNF04 | Usabilidade | Indicadores devem ser compreensíveis rapidamente (ex.: verde/amarelo/vermelho para lotação). | Alta |

---

## 4. REGRAS DE NEGÓCIO (RN)

- **[RN.01] Usuário autenticado:** Apenas usuário autenticado pode informar ou atualizar o status de lotação e condições.
- **[RN.02] Valores permitidos:** Lotação deve aceitar apenas valores definidos (ex.: vazio, moderado, lotado); condições (aros, redes, piso) devem aceitar escala definida (ex.: bom, regular, ruim ou 1–5).
- **[RN.03] Um status por espaço:** O sistema mantém um conjunto de status atual por espaço (lotação + condições); cada nova atualização substitui a anterior (ou segue regra de agregação definida, ex.: média das últimas N atualizações).
- **[RN.04] Opcional por campo:** Condições de aros, redes e piso podem ser opcionais; lotação pode ser obrigatória na atualização para manter consistência.
- **[RN.05] Limite de atualização:** Pode ser definido limite de atualizações por usuário por espaço em um intervalo (ex.: 1 vez a cada 30 minutos) para evitar abuso.
- **[RN.06] Exibição sem dados:** Se não houver status informado para um espaço, o sistema deve exibir "Não informado" ou equivalente, sem valor padrão enganoso.

---

## 5. FLUXO DE EVENTOS (CASO DE USO)

### 5.1 Cenário principal – Visualizar status (caminho feliz)
1. O usuário acessa a listagem de quadras/pistas ou o mapa.
2. O sistema exibe cada espaço com indicadores de lotação e condições (cores/ícones) e data da última atualização.
3. O usuário clica em um espaço para ver detalhes.
4. O sistema exibe a tela de detalhes com status completo (lotação, aros, redes, piso) e "Atualizado em [data/hora]".
5. Enquanto o usuário permanece na tela, o sistema atualiza os valores em tempo real se outro usuário alterar o status.

### 5.2 Cenário principal – Atualizar status (caminho feliz)
1. O usuário autenticado está na tela de detalhes da quadra/pista (ou acessa "Informar status" a partir do mapa/listagem).
2. O sistema exibe os campos: lotação (select) e, opcionalmente, condições de aros, redes, piso.
3. O usuário seleciona os valores e clica em "Atualizar".
4. O sistema valida conforme RN.01 a RN.05 e persiste o novo status.
5. O sistema exibe mensagem de sucesso e atualiza a exibição; outros usuários passam a ver o novo status em tempo real.

### 5.3 Fluxos de exceção / alternativos
- **[E01] Dados inválidos:** Se algum valor não estiver no conjunto permitido (RN.02), o sistema deve destacar o campo e exibir mensagem de erro.
- **[E02] Limite de atualização:** Se RN.05 for aplicada e o usuário tiver atingido o limite, o sistema deve exibir mensagem informando que poderá atualizar novamente após X minutos.
- **[E03] Falha de conexão:** Se a persistência ou o canal de tempo real falhar, o sistema deve exibir mensagem e permitir nova tentativa.
- **[E04] Conflito:** Se dois usuários atualizarem ao mesmo tempo, o sistema deve adotar política clara (ex.: última escrita vence) e refletir o resultado em tempo real.

---

## 6. CONCLUSÃO E VALIDAÇÃO

### 6.1 Histórico de Revisões

| Versão | Data | Autor | Alterações Realizadas |
|--------|------|-------|----------------------|
| 1.0 | [DD/MM/AAAA] | [Nome do Responsável] | Elaboração inicial do DEF. |

### 6.2 Considerações finais
- Este módulo **não existe no template**; é necessário definir modelo de dados (campos de status por espaço), persistência (ex.: Firestore) e mecanismo de tempo real (ex.: Firestore `onSnapshot` ou Realtime Database).
- O template já oferece: componentes de formulário, Select, Badge e padrões de listagem/detalhe, que podem ser reutilizados para exibir e editar o status.
- Dependências: backend ou Firestore com suporte a listeners em tempo real; definição de escala de lotação e condições com a equipe/product owner.
