# Meu Álbum Pokémon

App de coleção de cartas Pokémon TCG — busca o catálogo internacional, permite escanear cartas pela câmera, acompanhar o que você já tem e o que falta, com visual inspirado numa Pokédex. Funciona offline depois da primeira visita e pode ser instalado como app no celular (PWA).

## Arquivos do projeto

| Arquivo | Função |
|---|---|
| `index.html` | O app inteiro (interface + lógica) |
| `manifest.json` | Diz ao navegador como instalar o app (nome, cor, ícone) |
| `sw.js` | Service worker — cuida do cache pro app funcionar offline |
| `icon-192.png` / `icon-512.png` | Ícones do app |

**Importante:** os 5 arquivos precisam ficar juntos, na mesma pasta, no mesmo host. Não dá pra abrir só o `index.html` clicando duas vezes no arquivo (`file://`) e esperar que a instalação/offline funcionem — isso é uma restrição de segurança dos navegadores, exige `http://` ou `https://`.

## Como publicar de graça (GitHub Pages)

1. **Crie um repositório novo no GitHub**
   Acesse [github.com/new](https://github.com/new), dê um nome (ex.: `meu-album-pokemon`) e marque como público.

2. **Suba os 5 arquivos**
   Pela interface do GitHub: "Add file" → "Upload files" → arraste `index.html`, `manifest.json`, `sw.js`, `icon-192.png` e `icon-512.png` → "Commit changes".
   (Se preferir linha de comando, veja a seção Git abaixo.)

3. **Ative o GitHub Pages**
   No repositório: `Settings` → `Pages` (menu lateral) → em "Build and deployment", escolha `Deploy from a branch` → branch `main`, pasta `/ (root)` → `Save`.

4. **Acesse o app**
   Depois de 1-2 minutos, o GitHub mostra a URL, algo como:
   `https://SEU-USUARIO.github.io/meu-album-pokemon/`
   Abra essa URL pelo navegador do celular.

5. **Instale na tela inicial**
   - **Android (Chrome):** toque nos três pontinhos → "Instalar app" (ou toque no botão "Instalar" que aparece dentro do próprio app).
   - **iPhone (Safari):** toque no ícone de compartilhar → "Adicionar à Tela de Início". (O Safari não mostra o botão "Instalar" automático — esse caminho manual é o que funciona no iOS.)

## Usando Git pela linha de comando (alternativa ao passo 2)

```bash
git init
git add .
git commit -m "Primeira versão do app"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/meu-album-pokemon.git
git push -u origin main
```

## Como atualizar o app depois

Na maioria das vezes, é só isso:

1. Edite o `index.html` (ou peça pra mim editar).
2. Suba a versão nova pro GitHub (substituindo o arquivo, ou `git add . && git commit -m "atualização" && git push`).
3. Pronto — o service worker busca a versão mais nova automaticamente na próxima vez que alguém abrir o app com internet.

Só mexa no `sw.js` ou `manifest.json` se: quiser trocar o nome/ícone/cor do app, ou adicionar/remover algum dos arquivos da lista de cache (`SHELL_FILES` dentro do `sw.js`). Nesse caso, é boa prática subir o número da versão em `CACHE_VERSION` no topo do `sw.js`.

## Problemas comuns

- **"Instalar" não aparece:** só funciona em `https://` (GitHub Pages já serve assim) e em navegadores compatíveis (Chrome/Edge Android e desktop; no iPhone use o botão de compartilhar do Safari, como acima).
- **App não busca as cartas:** confira sua conexão com a internet — o catálogo vem da API pública da [TCGdex](https://tcgdex.dev/).
- **Alterei o app mas continuo vendo a versão antiga:** feche o app completamente (não só minimizar) e abra de novo — o service worker atualiza em segundo plano e aplica na próxima abertura.
