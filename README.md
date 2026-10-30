# Modern Galeria — RSF Eternity

Galeria de imagens/plantas/vídeos para injeção via script no 3DVista, hospedada no AWS S3.

**Projeto:** RSF Eternity
**Tema:** verde imersivo (`#325825` / `#EAFFF7`)

---

## URLs de produção

| Arquivo | URL |
|---------|-----|
| Galeria | `https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/rsf/galeria-eternity/index.html` |
| Vídeos  | `https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/rsf/galeria-eternity/video-gallery.html` |
| 360°    | `https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/rsf/galeria-eternity/galeria-360.html` |
| Obras  | `https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/rsf/galeria-eternity/obras.html` |
| Script  | `https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/rsf/galeria-eternity/inject.js` |

**S3 path:** `s3://skylineip/Tour Virtual/rsf/galeria-eternity/`

---

## Estrutura de arquivos

```
galeria-rsf-eternity/
├── index.html              ← galeria de imagens + plantas (auto-suficiente)
├── video-gallery.html      ← galeria de vídeos
├── galeria-360.html        ← galeria de panoramas 360° (setas pulsantes + editor)
├── diferenciais.html       ← ficha de diferenciais (scroll)
├── obras.html              ← andamento da obra (só Eternity; dados embutidos)
├── obras/                  ← fonte original com TODOS os projetos (não vai para git nem S3)
├── inject.js               ← loader leve para injeção no 3DVista
├── deploy.ps1              ← deploy para o S3 (Windows; sync)
├── generate_thumbs.ps1     ← gerador de thumbnails/large (Windows/GDI+, sem deps)
└── assets/
    ├── IMAGENS/              ← renders (JPG originais, só no S3)
    ├── PLANTAS/              ← plantas e implantações (JPG originais, só no S3)
    ├── obras/                ← foto do empreendimento usada em obras.html
    ├── VIDEO/                ← vídeo .mp4 (gitignored; direto no S3)
    ├── thumbs/               ← gerado (900 px) — vai para o git e S3
    ├── large/                ← gerado (2560 px, lightbox) — vai para o git e S3
    ├── lib/pannellum/        ← Pannellum (visualizador 360°)
    └── bg.png, close-*, voltar-*, proximo-*.png
```

> **Caminhos:** o S3 é case-sensitive; os `src` em `index.html` devem ter exatamente o mesmo case dos arquivos (`assets/IMAGENS/...`). Espaços são aceitos.
> **Novo conteúdo:** coloque os JPG em `assets/IMAGENS`/`assets/PLANTAS`, rode `./generate_thumbs.ps1`, adicione o item em `GALLERY_CONFIG.items` (`index.html`) e rode `./deploy.ps1`.

---

## Categorias e submenus

Definidos em `GALLERY_CONFIG.categories` (`index.html`). Cada item usa `category` + `subCategory`.

### Modo `imagens`

| Categoria | Submenus |
|-----------|----------|
| Fachadas | Fachadas · Vistas Aéreas |
| Lazer | Piscinas · Esportes · Convivência |
| Áreas Comuns | Social · Coworking · Serviços |
| Bem-estar | Fitness · Spa e Sauna |
| Apartamento Decorado | — |

### Modo `plantas`

Os submenus de Plantas viram o filtro principal: **Implantação** (geral, sem fundo, rooftop, masterplan) · **Plantas Tipo** (01/05, 02/04, 03, 06) · **Tipos Ampliados** · **Decorados** (01 e 02).

> No modo `all` as plantas aparecem como categoria "Plantas" com os mesmos submenus.

### Vídeos

`video-gallery.html` toca `assets/VIDEO/videoplayback.mp4`. A pasta `assets/VIDEO/` está no .gitignore (vai direto para o S3).

---

## Cards de plantas com abas (`cobertura-plan`)

Plantas que são **níveis de um mesmo conjunto** podem ser agrupadas num único card com abas
que alternam (e sobrepõem) as variantes. Quando há **exatamente 2 pisos**, aparece também
o botão "Ver ambas" (comparação lado a lado); com mais pisos, só as abas. Nenhum item do
projeto atual usa esse formato — todas as plantas são cards individuais —
mas o suporte permanece no motor da galeria para uso futuro:

```js
{ type:'cobertura-plan', category:'plantas', subCategory:'pl-apartamentos',
  title:'Pavimentos — Apartamentos', subtitle:'Apartamentos', floors:[
    { label:'Térreo',       src:'assets/plantas/terreo.jpg',       thumb:'assets/thumbs/plantas/terreo.jpg' },
    { label:'Tipo',         src:'assets/plantas/tipo.jpg',         thumb:'assets/thumbs/plantas/tipo.jpg' },
]},
```

---

## Thumbnails

Todo `src` da grade usa um `thumb` leve (**900 px, JPEG q82**, achatado sobre branco).
Geração **sem dependências** no Windows via GDI+:

```powershell
# Gera apenas os que faltam / desatualizados
./generate_thumbs.ps1

# Regenera todos
./generate_thumbs.ps1 -Force
```

O script espelha `assets/` em `assets/thumbs/` (sempre `.jpg`, mesmo caminho/case),
ignora `thumbs/`, `videos/` e o PDF. Também gera `large/` (~2560 px, q88) usado no lightbox.

> Alternativa multiplataforma: `python generate_thumbs.py` (requer Python + Pillow).

---

## Deploy AWS S3

> **Windows:** use o script pronto `./deploy.ps1` (faz o sync completo + `cache-control` no HTML/JS).
> Requer **AWS CLI** instalado e credenciais configuradas (`aws configure`) uma única vez.

### Sync completo

```bash
aws s3 sync . "s3://skylineip/Tour Virtual/rsf/galeria-eternity/" \
  --exclude ".git/*" --exclude ".claude/*" --exclude "*.py" \
  --exclude "README.md" --exclude ".gitattributes" --exclude "*.md" \
  --exclude "deploy.ps1" --exclude "*.pdf" \
  --delete
```

### Atualizar só index.html e inject.js

```bash
aws s3 cp index.html "s3://skylineip/Tour Virtual/rsf/galeria-eternity/index.html" \
  --cache-control "no-cache,no-store,must-revalidate"

aws s3 cp inject.js "s3://skylineip/Tour Virtual/rsf/galeria-eternity/inject.js" \
  --cache-control "no-cache,no-store,must-revalidate"
```

> **`--cache-control "no-cache,no-store,must-revalidate"`** — essencial para garantir que o browser nunca sirva uma versão cacheada do script ou da galeria.

---

## Integração 3DVista

### Passo 1 — Loader (colocar no JavaScript global do projeto)

```js
(function(){
  var s = document.createElement('script');
  s.src = 'https://skylineip.s3.sa-east-1.amazonaws.com/Tour+Virtual/rsf/galeria-eternity/inject.js?v=' + Date.now();
  document.head.appendChild(s);
})();
```

> **`?v=` + `Date.now()`** — cache-busting: força o browser a baixar sempre a versão mais recente do script, evitando que o 3DVista sirva uma versão antiga em cache.

### Passo 2 — Acionar nos hotspots/botões

```js
// Abre galeria de imagens
GaleriaImagens(1);

// Fecha galeria de imagens
GaleriaImagens(0);

// Abre galeria de plantas
GaleriaPlantas(1);

// Fecha galeria de plantas
GaleriaPlantas(0);

// Abre galeria de vídeos (vídeo 3D — video-gallery.html)
AbrirGaleriaVideos(1);

// Fecha galeria de vídeos
AbrirGaleriaVideos(0);

// Abre a ficha de diferenciais
AbrirDiferenciais(1);

// Fecha a ficha de diferenciais
AbrirDiferenciais(0);

// Abre a galeria 360° (galeria-360.html)
Galeria360(1);

// Fecha a galeria 360°
Galeria360(0);

// Abre o andamento da obra (obras.html — só Eternity Residence)
AbrirObras(1);

// Fecha o andamento da obra
AbrirObras(0);
```

---

## Galeria 360° (`galeria-360.html`)

17 panoramas equirretangulares (`assets/360/Scene 01–17.png`, 4096×2048). Cada local mostra **setas pulsantes**; ao clicar, abre o panorama do destino mantendo a direção do olhar. Tira de miniaturas ("Locais") embaixo para ir direto a qualquer ponto. Usa [Pannellum](https://pannellum.org) 2.5.6 (`assets/lib/pannellum/`).

### Preparar os arquivos

Coloque os PNGs em `assets/360/` e gere as versões web (JPEG ~2,4 MB) e miniaturas:

```bash
for f in assets/360/Scene*.png; do b=$(basename "$f" .png)
  ffmpeg -y -i "$f" -q:v 3 "assets/360/web/$b.jpg"
  ffmpeg -y -i "$f" -vf scale=480:-1 -q:v 4 "assets/thumbs/360/$b.jpg"
done
```

Os títulos dos locais ficam no array `SCENES` do HTML.

### Posicionar as setas (modo editor)

1. Abra `galeria-360.html?edit=1` (servindo a pasta por HTTP ou já no S3).
2. Gire o panorama e **clique** onde a seta deve ficar (marcador vermelho) → escolha o destino → **Adicionar seta aqui**. A opção "Criar também a volta" cria a seta de retorno na direção oposta (ajuste depois se precisar).
3. As edições ficam salvas no navegador (localStorage). Ao terminar, clique em **Copiar configuração** e cole o resultado no `const LINKS = {...}` do HTML; depois rode o deploy.

Para abrir direto num local: `galeria-360.html?scene=s05`.

---

## Andamento da Obra (`obras.html`)

Painel de progresso físico **exclusivo do Eternity Residence** (não há seletor de obra; os dados dos demais projetos não são incluídos no arquivo). Mostra avanço acumulado, avanço no mês, desvio real × tendência, % por atividade (14 etapas) e gráfico dos últimos 9 meses. Único filtro: **período de referência** (mês/ano + setas). Tema terracota `#BC6C49`, página única sem dependências (gráfico em SVG próprio).

- **Fonte:** `obras/PROGRESSO-OBRAS-TODOS.html` (planilha de todos os projetos — ignorada pelo git e excluída do S3).
- **Dados:** constante `DATA` no início do `<script>` de `obras.html` (`obras`, `atividades`, `evolucao`). A cada medição, acrescente as linhas do novo mês (`evolucao`: `mes`, `tendencia`, `real`; `atividades`: 14 linhas com `mes`, `ordem`, `atividade`, `realizado`, `casas_decimais`), atualize `avanco_fisico` e `mes_referencia` em `obras` e a data `GERADO_EM`. O eixo Y usa `eixo_max`/`eixo_passo`.
- **Foto:** `assets/obras/eternity.jpg`.
- **3DVista:** `AbrirObras(1)` abre / `AbrirObras(0)` fecha (ver *Integração 3DVista*). O botão de fechar envia `closeGallery` ao 3DVista, como as demais telas.
- **Deploy:** `./deploy.ps1` (ou `aws s3 cp obras.html ... --cache-control no-cache`).

---

## Cores e tipografia

Tema **verde imersivo** do RSF Eternity:

| Token CSS | Valor | Papel |
|-----------|-------|-------|
| `--bg` (fundo) | `#325825` | Verde-escuro principal (fundo) — cor primária |
| `--surface` | `#073C28` | Superfície de card |
| `--dark` (foreground) | `#EAFFF7` | Texto/ícones (verde-claro) — cor secundária |
| `--accent` | `#EAFFF7` | Destaque / estado ativo (usa a secundária sobre fundo escuro) |
| Fonte títulos | Cormorant Garamond | — |
| Fonte UI | Inter | — |

> Plantas técnicas mantêm **fundo claro** no card (`#EAFFF7`, para legibilidade do desenho), com texto verde-escuro (`#325825`) — a mesma dupla primária/secundária, com os papéis invertidos.
