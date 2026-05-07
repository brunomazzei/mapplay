# DOCUMENTO DE ESPECIFICAÇÃO FUNCIONAL (DEF) – Mapa Interativo

| Campo | Valor |
|-------|--------|
| **Identificação do Projeto** | [NOME DO SISTEMA] |
| **Módulo/Funcionalidade** | Mapa Interativo (Quadras e Pistas) |
| **Versão Documental** | 1.0 |
| **Data da Última Atualização** | [DATA] |

---

## 1. INTRODUÇÃO

### 1.1 Propósito
Este documento descreve as especificações funcionais e as regras de negócio do módulo de **Mapa Interativo**, que permite visualizar e cadastrar quadras e pistas em um mapa, com fotos e localização exata, centralizando informações sobre espaços públicos.

### 1.2 Escopo
- **Faz:** Exibir mapa com marcadores de quadras/pistas; visualizar detalhes ao clicar em um marcador (fotos, endereço, condições); cadastrar nova quadra/pista com nome, endereço, coordenadas e fotos; listar quadras/pistas (opcional); filtrar por tipo (quadra/pista) ou região.
- **Não faz:** Edição em tempo real colaborativa do mapa; navegação turn-by-turn até o local; reserva de quadra pelo mapa (reserva é tratada no módulo de Eventos); moderação automática de fotos.

---

## 2. REQUISITOS FUNCIONAIS (RF)

| ID | Título | Descrição | Prioridade |
|----|--------|-----------|------------|
| RF01 | Visualizar mapa | O sistema deve exibir um mapa interativo com marcadores das quadras e pistas cadastradas. | Alta |
| RF02 | Visualizar detalhes | O sistema deve exibir detalhes da quadra/pista (fotos, endereço, condições) ao clicar no marcador ou em item da lista. | Alta |
| RF03 | Cadastrar espaço | O sistema deve permitir que usuário autenticado cadastre nova quadra ou pista com nome, endereço, localização (coordenadas ou seleção no mapa) e fotos. | Alta |
| RF04 | Editar espaço | O sistema deve permitir que o criador ou administrador edite dados de uma quadra/pista já cadastrada. | Moderada |
| RF05 | Listagem | O sistema deve permitir listar quadras e pistas com filtros (tipo, região, busca por nome). | Moderada |
| RF06 | Fotos | O sistema deve exibir fotos do espaço no cadastro e na visualização de detalhes; suportar múltiplas fotos no cadastro. | Alta |
| RF07 | Localização exata | O sistema deve armazenar e exibir a localização exata (coordenadas) do espaço no mapa. | Alta |

---

## 3. REQUISITOS NÃO FUNCIONAIS (RNF)

| ID | Título | Descrição | Prioridade |
|----|--------|-----------|------------|
| RNF01 | Performance | O mapa deve carregar em tempo aceitável; marcadores devem ser agrupados ou limitados em zoom inicial se necessário. | Alta |
| RNF02 | Responsividade | A tela do mapa e os formulários devem ser utilizáveis em dispositivos móveis. | Alta |
| RNF03 | Armazenamento de imagens | Fotos devem ser armazenadas em serviço adequado (ex.: Firebase Storage) com tamanho/qualidade balanceados. | Alta |
| RNF04 | Precisão | Coordenadas devem permitir identificar o local com precisão suficiente para navegação (ex.: GPS). | Moderada |

---

## 4. REGRAS DE NEGÓCIO (RN)

- **[RN.01] Usuário autenticado:** Apenas usuário autenticado pode cadastrar ou editar quadra/pista.
- **[RN.02] Campos obrigatórios:** No cadastro, são obrigatórios: nome, tipo (quadra/pista), localização (coordenadas ou ponto no mapa) e pelo menos uma foto (conforme definição do produto).
- **[RN.03] Coordenadas:** A localização deve ser definida por coordenadas (lat/lng) ou pela seleção de um ponto no mapa; o sistema deve validar que o ponto está dentro da área de cobertura permitida, se houver.
- **[RN.04] Fotos:** Formato e tamanho máximo de arquivo devem seguir política definida (ex.: JPEG/PNG, máx. 5MB por foto); número máximo de fotos por espaço pode ser limitado (ex.: 10).
- **[RN.05] Edição:** Apenas o usuário que criou o registro ou perfil com permissão de administrador pode editar ou excluir a quadra/pista.
- **[RN.06] Duplicidade:** O sistema pode alertar ou impedir cadastro de local muito próximo a outro já existente (raio em metros a definir).

---

## 5. FLUXO DE EVENTOS (CASO DE USO)

### 5.1 Cenário principal – Visualizar mapa (caminho feliz)
1. O usuário acessa a tela do Mapa.
2. O sistema carrega o mapa e exibe os marcadores das quadras/pistas cadastradas.
3. O usuário navega (zoom, arrastar) e clica em um marcador.
4. O sistema exibe popup ou painel com resumo (nome, endereço, foto principal) e opção "Ver detalhes".
5. O usuário clica em "Ver detalhes" e o sistema exibe a tela completa com todas as fotos e informações.

### 5.2 Cenário principal – Cadastrar quadra/pista (caminho feliz)
1. O usuário autenticado acessa "Cadastrar quadra/pista" (menu ou botão no mapa).
2. O sistema exibe formulário com campos: nome, tipo, endereço, localização (mapa para clicar ou campos lat/lng), fotos (upload).
3. O usuário preenche os dados, seleciona o ponto no mapa (se aplicável) e envia as fotos.
4. O sistema valida conforme RN.01 a RN.06.
5. O sistema persiste o espaço, exibe mensagem de sucesso e redireciona para o mapa ou para a listagem.

### 5.3 Fluxos de exceção / alternativos
- **[E01] Dados inválidos:** Se a validação falhar (RN.02, RN.03, RN.04), o sistema deve destacar os campos em erro e exibir mensagens específicas.
- **[E02] Localização não selecionada:** Se o cadastro exigir ponto no mapa e o usuário não selecionar, o sistema deve solicitar a seleção antes de submeter.
- **[E03] Falha no upload:** Em caso de falha no envio de fotos, o sistema deve exibir mensagem e permitir nova tentativa sem perder os demais dados do formulário.
- **[E04] Sem conexão:** Se o mapa ou a lista não carregar por indisponibilidade de rede, o sistema deve exibir mensagem e opção de tentar novamente.

---

## 6. CONCLUSÃO E VALIDAÇÃO

### 6.1 Histórico de Revisões

| Versão | Data | Autor | Alterações Realizadas |
|--------|------|-------|----------------------|
| 1.0 | [DD/MM/AAAA] | [Nome do Responsável] | Elaboração inicial do DEF. |

### 6.2 Considerações finais
- Este módulo **não existe no template**; é necessário integrar uma biblioteca de mapa (ex.: Leaflet, Google Maps, Mapbox) e implementar telas de mapa, cadastro e detalhes.
- O template já oferece: componente de Upload de arquivos, formulários com validação (react-hook-form + Zod), padrão de listagem e de tela de detalhes, que podem ser reutilizados.
- Dependências: API de mapas (Google/OpenStreetMap/Mapbox), Firebase Storage ou similar para fotos, backend ou Firestore para persistência dos espaços.
