# Regras de Negócio — MAPPLAY

> Referência direta ao escopo. Cada RN tem seu impacto técnico mapeado para orientar as decisões de implementação.

---

## RN01 — Cadastro por Consenso Democrático

**Regra:** Um novo espaço só é registrado e visível no mapa quando **pelo menos 3 usuários diferentes** cadastrarem a mesma localização.

**Impacto técnico:**
- Espaços ficam em estado `PENDING` até atingir 3 confirmações
- Back-end precisa de lógica de agrupamento geográfico (raio de tolerância em metros)
- Front-end exibe marcadores pendentes com visual diferenciado (ex: pin translúcido ou cinza)
- Ao atingir 3 confirmações, espaço muda para `VALIDATED` automaticamente

**Decisão pendente:** Definir o raio de tolerância para considerar dois cadastros como "mesmo local" (sugestão: 50m)

---

## RN02 — Exclusividade de Espaços Públicos

**Regra:** Só é permitido cadastrar equipamentos do **Sistema de Lazer Esportivo público** (praças, centros comunitários).

**Impacto técnico:**
- Formulário de cadastro exige declaração explícita de que o local é público
- Não há moderador: a responsabilidade é declaratória do usuário
- Futuramente: pode-se cruzar com base de dados aberta da prefeitura

---

## RN03 — Geolocalização Obrigatória

**Regra:** O envio das coordenadas GPS (latitude/longitude) é indispensável.

**Impacto técnico:**
- Formulário só habilita envio após captura de geolocalização via `navigator.geolocation`
- Exibir mapa de confirmação antes do envio (o usuário vê onde será cadastrado)
- Tratar casos de permissão de localização negada (mensagem de erro orientativa)
- Campo de endereço textual é complementar, não substituto das coordenadas

---

## RN04 — Atributos Técnicos por Modalidade

**Regra:** O formulário de cadastro exige dados específicos conforme a modalidade escolhida.

| Modalidade | Campo obrigatório |
|------------|-------------------|
| Basquete 🏀 | Altura da cesta (ex: regulamentar, baixa, adaptada) |
| Skate 🛹 | Tipo de obstáculo (ex: bowl, half-pipe, street, flatground) |
| Futebol ⚽ | Tipo de gramado (ex: grama natural, sintético, areia, cimento) |

**Impacto técnico:**
- Formulário dinâmico: exibe campos adicionais ao selecionar a modalidade
- Schema de validação (Zod/Yup) com campos condicionais

---

## RN05 — Limitação de Responsabilidade na Zeladoria

**Regra:** A plataforma **facilita** a organização comunitária mas **não se responsabiliza** pela manutenção física.

**Impacto técnico:**
- Exibir aviso legal no fórum e nos eventos de mutirão
- Funcionalidade: usuários organizam mutirões por iniciativa própria — a plataforma apenas conecta
- Notificações de mutirão são enviadas a usuários próximos para incentivar participação

---

## RN06 — Acesso aos Dados e Transparência

**Regra:** Estatísticas básicas são abertas à comunidade. Dashboards analíticos são exclusivos para perfis administrativos e parceiros governamentais.

**Impacto técnico:**
- Dois níveis de acesso: `USER` e `ADMIN`
- Usar `AuthorityGuard` (já existe no template) para proteger rotas de dashboard
- Definir quais métricas são públicas vs. restritas:
  - **Público:** contagem de espaços, eventos realizados, rankings por bairro
  - **Admin/Parceiro:** mapa de calor, evolução de conservação, exportação de dados

---

## Referências

- [[escopo-projeto-mapplay]] — Documento original do professor
- [[roadmap-desenvolvimento]] — Onde cada RN é implementada
