# The Ninth Art — Experience MVP

Este MVP transforma `experience.html` em uma landing page/HQ interativa para **Hagia & Pio: A Máquina do Bolo de Mandioca**.

## Como executar

```bash
python3 -m http.server 4173
```

Abra `http://localhost:4173/experience.html`.

## Arquitetura

- `data/eras.json`: eras extensíveis, iniciando em passado, presente e futuro.
- `data/machine-parts.json`: cinco peças da máquina com pesos temporais.
- `data/kitchen-objects.json`: oito objetos de cozinha, cada um com versões em array por era.
- `data/story-panels.json`: doze estados narrativos da HQ.
- `scripts/modules/temporal-engine.js`: normalização de vetores, era dominante, fallback de versão e seed determinístico.
- `scripts/modules/state-store.js`: sessão individual, persistência local e interface remota stub.
- `scripts/modules/public-state.js`: cálculo local de estado público agregado.
- `scripts/modules/kitchen-renderer.js`: renderização da cozinha em camadas.
- `scripts/modules/carousel.js`: componente reutilizável de peças com ARIA, teclado, setas, pontos e pausa.
- `scripts/modules/admin-panel.js`: painel interno em `dialog` para exportar, limpar e restaurar dados locais.

## Motor temporal

A assinatura individual é calculada como:

```text
V_i = normalize(Σ vetores das peças + 0.25 × Σ vetores dos objetos)
```

O estado público local é:

```text
V_public = normalize(Σ w_i × V_i)
```

com peso de sessão derivado de recência, conclusão e diversidade. A versão visual de cada objeto é escolhida pela era dominante; se não houver versão direta, o motor usa a era mais próxima por `order`.

## Persistência

O MVP usa `localStorage` por meio do adaptador `localPersistence`. A UI não acessa `localStorage` diretamente. O `remotePersistence` existe como contrato para backend futuro, mas não está conectado a nenhum serviço real.

## Limitações conhecidas

- O estado multiusuário é local ao navegador; não há backend público real.
- Hagia, Pio e Abuela usam placeholders semânticos, porque artes finais não existem no repositório.
- Imagens em `imagensPrompt/` são placeholders temporários e estão marcadas no HTML com `data-asset-status="temporary-reference"`.
- O painel interno valida apenas ações básicas do MVP; edição granular de cada campo ainda é um próximo passo.
