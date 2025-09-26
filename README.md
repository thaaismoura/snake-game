# Snake — Jogo da Cobrinha (HTML/CSS/JS)

Jogo simples da cobrinha feito com **HTML**, **CSS** e **JavaScript**.  
Pronto para rodar no navegador e publicar com **GitHub Pages**.

---

## 📁 Estrutura do repositório
Coloque estes arquivos na raiz do repositório:
- `index.html` — interface principal
- `style.css` — estilos
- `script.js` — lógica do jogo

(Se você usou o código sugerido, já está tudo pronto.)

---

## 🚀 Como publicar no GitHub (passo a passo)
1. Crie um repositório no GitHub (por exemplo: `snake-game`) — escolha **Public**.
2. Adicione os 3 arquivos (`index.html`, `style.css`, `script.js`) na raiz:
   - Pelo navegador: abra o repo → `Add file` → `Create new file` → cole o conteúdo → `Commit new file`.
   - Ou pressione `.` (ponto) com o repo aberto para editar no **github.dev** (VS Code no navegador).
3. Ative o GitHub Pages:
   - Vá em **Settings** → **Pages**.
   - Em **Source**, selecione branch `main` (ou `master`) e pasta `/ (root)`.
   - Salve. Após alguns segundos/minutos, o GitHub fornecerá a URL do site:  
     `https://<seu-usuario>.github.io/<nome-do-repo>/`
4. Acesse a URL e seu jogo aparecerá (o `index.html` é carregado automaticamente).

---

## 🧪 Testar localmente
- Método rápido: dê um duplo clique em `index.html` para abrir no navegador.
- Servidor local (recomendado para evitar problemas com módulos/recursos):
  - Usando Python (se instalado):  
    ```bash
    # na pasta do projeto
    python -m http.server 8000
    # abra http://localhost:8000
    ```
  - Ou use a extensão **Live Server** no VS Code.

---

## 🎮 Como jogar / Controles
- Teclado: setas ← ↑ → ↓ ou WASD.
- Reiniciar: tecla `Espaço` ou clique no canvas quando estiver em **Game Over**.
- Pontuação exibida no HUD.

---

## ⚙️ Personalizações fáceis
- Mudar velocidade: no `script.js`, altere a constante `TICK` (ms por frame). Menor = mais rápido.
- Alterar tamanho da grade: ajuste `TILE` e `GRID` no `script.js`.
- Sons: use `new Audio('som.mp3').play()` ao comer/morrer.
- Salvar highscore: usar `localStorage` (ex.: `localStorage.setItem('best', bestScore)`).

---

## 📱 (Opcional) Adaptação para Mobile — controles na tela
Se quiser suporte a telas touch, adicione botões de controle no `index.html` e listeners em `script.js`. Exemplo mínimo:

**HTML** (adicionar próximo ao canvas):
```html
<div id="mobile-controls" class="mobile-controls">
  <button data-dir="up">↑</button>
  <button data-dir="left">←</button>
  <button data-dir="down">↓</button>
  <button data-dir="right">→</button>
</div>
# snake-game
