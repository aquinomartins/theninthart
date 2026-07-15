# Tempo — pacote autônomo

## Objetivo da pasta

`tempo/` contém uma cópia publicável e independente da página inicial do The Ninth Art, preparada para ser servida em `https://www.theninthart.com/tempo/` sem depender de CSS, JavaScript ou imagens locais fora desta pasta.

## Arquivo inicial

- Entrada pública: `tempo/index.html`
- URL pública esperada: `https://www.theninthart.com/tempo/`
- Redirecionamento legado: `tempo.html` aponta para `./tempo/`.

## Estrutura de diretórios

```text
tempo/
  index.html
  README.md
  images/
  scripts/
    main.js
  styles/
    main.css
```

## Arquivos copiados e origem

| Recurso | Caminho original | Novo caminho | Status |
|---|---|---|---|
| HTML principal | `index.html` | `tempo/index.html` | Copiado e adaptado |
| CSS principal | `styles.css` | `tempo/styles/main.css` | Copiado |
| JS principal | `script.js` | `tempo/scripts/main.js` | Copiado |
| Hero/visual 01 | A inserir via GitHub | `tempo/images/imagem013.png` | Referência preparada; binário não versionado |
| Visual 02 | A inserir via GitHub | `tempo/images/imagem010.png` | Referência preparada; binário não versionado |
| Visual 03 | A inserir via GitHub | `tempo/images/imagem1.png` | Referência preparada; binário não versionado |
| Visual 04 | A inserir via GitHub | `tempo/images/imagem2.png` | Referência preparada; binário não versionado |
| Visual 05 | A inserir via GitHub | `tempo/images/imagem014.png` | Referência preparada; binário não versionado |
| Visual 06 | A inserir via GitHub | `tempo/images/imagem4.png` | Referência preparada; binário não versionado |

## Dependências transitivas encontradas

- `tempo/index.html` carrega `./styles/main.css`, `./scripts/main.js` e referencia seis imagens futuras em `./images/`.
- `tempo/styles/main.css` não contém `url(...)`, `@import` ou `@font-face` com arquivos locais.
- `tempo/scripts/main.js` não contém `import`, `fetch`, `Worker`, `serviceWorker`, `localStorage`, `sessionStorage`, `new Image()` ou carregamento dinâmico de arquivos.
- Não há JSON, manifests, fontes locais, áudio, vídeo, templates externos, service worker ou workers necessários para esta cópia.

## Dependências externas

| Dependência | Tipo | Status |
|---|---|---|
| `mailto:contact@theninthart.com` | Link externo de e-mail | Mantido |
| `../experience.html` | Navegação deliberada para outra experiência do site | Mantida; não é recurso necessário para renderização |

Não há CDN, analytics, APIs, fontes externas ou formulários remotos nesta página.

## Chaves de armazenamento

Nenhuma chave de `localStorage`, `sessionStorage`, IndexedDB ou cookie é usada por `tempo/index.html` ou `tempo/scripts/main.js`.

## Service worker e cache

A página original não registra service worker no conjunto auditado (`index.html`, `styles.css`, `script.js`). Portanto, `tempo/` não cria nem registra service worker. A estratégia de cache fica a cargo do servidor/CDN; não há precache local.

## Instruções para executar localmente

A partir da raiz do repositório:

```bash
python3 -m http.server 4173
```

Abra:

```text
http://127.0.0.1:4173/tempo/
```

## Instruções para publicar

Publique a pasta `tempo/` como diretório estático. O servidor deve servir `tempo/index.html` para a rota `/tempo/`. O arquivo `tempo.html` permanece apenas como redirecionamento HTML legado para `./tempo/`.

## Verificação de isolamento

Método executado nesta versão:

1. Copiar `tempo/` para um diretório temporário vazio.
2. Servir somente a cópia isolada com `python3 -m http.server`.
3. Abrir `http://127.0.0.1:<porta>/` via Playwright/Chromium.
4. Registrar requisições locais e confirmar que todas resolvem dentro da pasta isolada.
5. Confirmar ausência de HTTP 404/500 e ausência de erros de console.

## Limitações encontradas

A página raiz referenciava caminhos `images/...`, mas não havia diretório `images/` na raiz do repositório. Por solicitação de revisão, arquivos binários de imagem não são versionados neste pacote; `tempo/index.html` mantém referências relativas estáveis para os seis arquivos que serão inseridos posteriormente pelo GitHub em `tempo/images/`.

## Arquivos que não puderam ser isolados

Os seis binários de imagem ficaram deliberadamente fora do commit por incompatibilidade com o fluxo de revisão. Os caminhos finais já estão reservados dentro de `tempo/images/`; links de navegação deliberada para fora da experiência não são dependências de renderização.

## Configuração de servidor necessária

Servidor estático comum com suporte a `index.html` em diretórios. Não há necessidade de reescrita especial, build step, bundler, headers customizados ou service worker.

## Versão da cópia

- Versão: `tempo-copy-v2-no-binaries`
- Data: 2026-07-15
