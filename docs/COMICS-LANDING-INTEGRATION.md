# Integração HQ da landing page

A página `experience.html` foi preservada semanticamente e agora recebe uma camada editorial de quadrinhos gerada por `scripts/comic-layout-engine.js` a partir de `scripts/comics-manifest.js`.

## Limitações encontradas antes

- A superfície visual usava placeholders e imagens de prompt em cards, criando blocos escuros e áreas vazias.
- As seções funcionavam como módulos de produto tradicionais, não como páginas/quadros contínuos.
- As interações alteravam principalmente textos, números e a cozinha, sem reflexo suficiente em quadros narrativos visíveis.

## Classificação de assets

- `panel`: `hq001.png` a `hq010.png`.
- `composite-page`: `imagemHQ1.png`, páginas `ChatGPT Image ...`, `dde05d0e...png`, `Design sem nome(5).png`, `Design sem nome(6).png`.
- `scene`: `imagem013.png`, `imagem018.png`, `imagem020.png`, `imagem021.png`.
- `interactive-reference`: `d9a98e4...jpg`.
- `layout-reference`: catalogado no manifesto, não renderizado automaticamente.

## Ordem narrativa

1. Cozinha e bolo: `hq008`, `hq009`, `hq010`, `imagemHQ1`.
2. Mecanismo: `hq001` a `hq005`.
3. Viagem: `hq006`, `hq007`, páginas multipainéis de viagem e dinossauros.
4. Cozinha pública e retorno: `dde05d0e...`, `Design sem nome...`, cenas `imagem013`, `imagem018`, `imagem020`, `imagem021`.

## Grids implementados

- `hero-three`.
- `asymmetric-story`.
- `diagonal-strips` com fallback sem `clip-path`.
- `rail-stack`.
- `editorial-mosaic`.

## Seção x quadrinhos

| Seção | Grid utilizado | Imagens | Interações preservadas |
|---|---|---|---|
| Hero | hero-three | `imagemHQ1`, `hq008`, `hq009`, `hq010` | CTA e âncora inicial |
| Overview/Vestige | asymmetric-story | `hq008`, `hq009`, `hq010`, `imagemHQ1`, `imagem013` | details de estado temporal |
| System | rail-stack | `hq001` a `hq005` | carrossel, tabs, pause/next/prev, seleção de peças |
| Objetos | editorial-mosaic | `imagem013`, `imagem018`, `imagem020`, `imagem021`, `hq005`, `hq006` | seleção de objetos e aria-live |
| Cozinha | hero-three/custom | `imagemHQ1`, `hq008`, `hq009`, `hq010` + camadas da cozinha | renderização por camadas, âncora do elemento voador, objetos reativos |
| Público | asymmetric-story | `dde05d0e...`, `Design sem nome...`, cenas finais | credenciais, timeline individual/pública, salvar sessão |
| Footer/finale | hero-three/editorial | páginas finais e cenas verticais | reset e navegação |

## Estratégia mobile e performance

Mobile usa fluxo flexível em ordem DOM, imagens completas com `object-fit: contain`, sarjetas menores e texto real em sobreposição translúcida. Imagens essenciais recebem dimensões declaradas; o primeiro painel usa eager/fetchpriority. O manifesto já contém campos para AVIF/WebP futuros.
