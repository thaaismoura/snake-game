// Jogo da cobrinha - simples e comentado
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const TILE = 20;         // tamanho do tile em px
const GRID = 20;         // número de tiles por linha/coluna
canvas.width = TILE * GRID;
canvas.height = TILE * GRID;

// Estado do jogo
let snake, dir, nextDir, apple, score, gameOver;

// Inicializa / reinicia
function resetGame() {
  snake = [
    {x: Math.floor(GRID/2), y: Math.floor(GRID/2)},
    {x: Math.floor(GRID/2)-1, y: Math.floor(GRID/2)},
    {x: Math.floor(GRID/2)-2, y: Math.floor(GRID/2)}
  ];
  dir = {x: 1, y: 0};      // indo para a direita
  nextDir = {...dir};
  apple = spawnApple();
  score = 0;
  gameOver = false;
  updateScore();
}

function spawnApple() {
  let pos;
  do {
    pos = { x: Math.floor(Math.random()*GRID), y: Math.floor(Math.random()*GRID) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

function updateScore(){ scoreEl.textContent = 'Pontos: ' + score; }

// Lógica de atualização (movimentação, comer maçã, colisões)
function update() {
  if (gameOver) return;
  // aplica próxima direção (evita reversão)
  if (!(nextDir.x === -dir.x && nextDir.y === -dir.y)) dir = nextDir;

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // colisão com paredes -> game over
  if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
    gameOver = true;
    return;
  }

  // colisão com o próprio corpo -> game over
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    gameOver = true;
    return;
  }

  snake.unshift(head); // adiciona nova cabeça

  // comer maçã?
  if (head.x === apple.x && head.y === apple.y) {
    score += 1;
    apple = spawnApple();
    updateScore();
  } else {
    snake.pop(); // remove cauda se não comeu
  }
}

// Desenho
function draw() {
  // fundo
  ctx.fillStyle = '#e6eef6';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // grade (opcional sutil)
  ctx.strokeStyle = 'rgba(0,0,0,0.03)';
  for (let i=0;i<=GRID;i++){
    ctx.beginPath();
    ctx.moveTo(i*TILE,0); ctx.lineTo(i*TILE,canvas.height); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0,i*TILE); ctx.lineTo(canvas.width,i*TILE); ctx.stroke();
  }

  // maçã
  ctx.fillStyle = '#d93b3b';
  roundRectFill(apple.x * TILE + 2, apple.y * TILE + 2, TILE-4, TILE-4, 4);

  // cobra
  for (let i=0;i<snake.length;i++){
    const s = snake[i];
    ctx.fillStyle = i===0 ? '#14632a' : '#2b8a3e'; // cabeça mais escura
    roundRectFill(s.x * TILE + 1, s.y * TILE + 1, TILE-2, TILE-2, 4);
  }

  // overlay de game over
  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '20px system-ui, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 10);
    ctx.font = '14px system-ui, Arial';
    ctx.fillText('Pressione Espaço para reiniciar', canvas.width/2, canvas.height/2 + 16);
  }
}

// helper rounded rect filled
function roundRectFill(x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
  ctx.fill();
}

// loop controlado por tempo (para velocidade estável)
let last = 0;
const TICK = 150; // ms por frame (diminua para ficar mais rápido)
function loop(ms){
  if (!last) last = ms;
  if (ms - last >= TICK) {
    update();
    draw();
    last = ms;
  }
  requestAnimationFrame(loop);
}

// controles teclado
window.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') setNextDir(0,-1);
  if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') setNextDir(0,1);
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setNextDir(-1,0);
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setNextDir(1,0);
  if (e.key === ' ' && gameOver) { e.preventDefault(); resetGame(); }
});

function setNextDir(x,y){
  // evita reversão instantânea
  if (x === -dir.x && y === -dir.y) return;
  nextDir = {x,y};
}

// restart ao clicar no canvas quando game over
canvas.addEventListener('click', ()=>{
  if (gameOver) resetGame();
});

// inicializa
resetGame();
requestAnimationFrame(loop);
document.querySelectorAll('#mobile-controls button').forEach(btn=>{
  btn.addEventListener('touchstart', (e)=>{
    e.preventDefault();
    const dir = btn.dataset.dir;
    if(dir==='up') setNextDir(0,-1);
    if(dir==='down') setNextDir(0,1);
    if(dir==='left') setNextDir(-1,0);
    if(dir==='right') setNextDir(1,0);
  });
  // opcional mouse
  btn.addEventListener('mousedown', ()=> {
    const dir = btn.dataset.dir;
    if(dir==='up') setNextDir(0,-1);
    if(dir==='down') setNextDir(0,1);
    if(dir==='left') setNextDir(-1,0);
    if(dir==='right') setNextDir(1,0);
  });
  let box = 32;
let snake = [];
snake[0] = { x: 8 * box, y: 8 * box };

let direction = "right";
let food = {
  x: Math.floor(Math.random() * 15 + 1) * box,
  y: Math.floor(Math.random() * 15 + 1) * box
};

// Aqui definimos a velocidade inicial (quanto menor o número, mais rápido)
let speed = 200; // começa devagar: 200ms
let level = 1;
let game;

function iniciarJogo() {
  if (snake[0].x > 15 * box || snake[0].x < 0 ||
      snake[0].y > 15 * box || snake[0].y < 0) {
    clearInterval(game);
    alert("Game Over! Nível " + level);
    return;
  }

  // desenha fundo
  context.fillStyle = "lightgreen";
  context.fillRect(0, 0, 16 * box, 16 * box);

  // desenha cobra
  for (let i = 0; i < snake.length; i++) {
    context.fillStyle = (i == 0) ? "darkgreen" : "green";
    context.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // desenha comida
  context.fillStyle = "red";
  context.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction == "right") snakeX += box;
  if (direction == "left") snakeX -= box;
  if (direction == "up") snakeY -= box;
  if (direction == "down") snakeY += box;

  if (snakeX != food.x || snakeY != food.y) {
    snake.pop();
  } else {
    food.x = Math.floor(Math.random() * 15 + 1) * box;
    food.y = Math.floor(Math.random() * 15 + 1) * box;

    // 🎯 cada vez que a cobra come → aumenta nível e acelera
    if (level < 10) { // limite de nível
      level++;
      speed -= 15; // diminui intervalo = aumenta velocidade
      clearInterval(game);
      game = setInterval(iniciarJogo, speed);
    }
  }

  let newHead = { x: snakeX, y: snakeY };
  snake.unshift(newHead);
}

// primeiro start
game = setInterval(iniciarJogo, speed);

// controle das setas
document.addEventListener("keydown", function(event) {
  if (event.key == "ArrowLeft" && direction != "right") direction = "left";
  if (event.key == "ArrowUp" && direction != "down") direction = "up";
  if (event.key == "ArrowRight" && direction != "left") direction = "right";
  if (event.key == "ArrowDown" && direction != "up") direction = "down";
});
document.querySelectorAll('#mobile-controls button').forEach(btn=>{
  btn.addEventListener('touchstart', (e)=>{
    e.preventDefault();
    const dir = btn.dataset.dir;
    if(dir==='up') setNextDir(0,-1);
    if(dir==='down') setNextDir(0,1);
    if(dir==='left') setNextDir(-1,0);
    if(dir==='right') setNextDir(1,0);
  });
  // opcional mouse
  btn.addEventListener('mousedown', ()=> {
    const dir = btn.dataset.dir;
    if(dir==='up') setNextDir(0,-1);
    if(dir==='down') setNextDir(0,1);
    if(dir==='left') setNextDir(-1,0);
    if(dir==='right') setNextDir(1,0);
  });
});
});
