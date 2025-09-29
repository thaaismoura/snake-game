// Jogo da cobrinha - versão com sons + fundo + créditos
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const pauseBtn = document.getElementById('pauseBtn');
const menu = document.getElementById('menu');
const startBtn = document.getElementById('startBtn');

const TILE = 20;
const GRID = 20;
canvas.width = TILE * GRID;
canvas.height = TILE * GRID;

// Sons
const eatSound = new Audio("eat.mp3");
const moveSound = new Audio("move.mp3");

// Fundo
const bgImg = new Image();
bgImg.src = "fundo.jpg";

// Estado do jogo
let snake, dir, nextDir, apple, score, gameOver, level, tickBase, tickCurrent, paused;

// Inicializa / reinicia
function resetGame() {
  snake = [
    {x: Math.floor(GRID/2), y: Math.floor(GRID/2)},
    {x: Math.floor(GRID/2)-1, y: Math.floor(GRID/2)},
    {x: Math.floor(GRID/2)-2, y: Math.floor(GRID/2)}
  ];
  dir = {x: 1, y: 0};
  nextDir = {...dir};
  apple = spawnApple();
  score = 0;
  level = 1;
  tickBase = 250;
  tickCurrent = tickBase;
  gameOver = false;
  paused = false;
  updateHUD();
}

function spawnApple() {
  let pos;
  do {
    pos = { x: Math.floor(Math.random()*GRID), y: Math.floor(Math.random()*GRID) };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

function updateHUD(){
  scoreEl.textContent = 'Pontos: ' + score;
  levelEl.textContent = 'Nível: ' + level;
}

// Lógica de atualização
function update() {
  if (gameOver || paused) return;
  if (!(nextDir.x === -dir.x && nextDir.y === -dir.y)) dir = nextDir;

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
    gameOver = true;
    return;
  }
  if (snake.some(s => s.x === head.x && s.y === head.y)) {
    gameOver = true;
    return;
  }

  snake.unshift(head);
  moveSound.currentTime = 0;
  moveSound.play().catch(()=>{});

  if (head.x === apple.x && head.y === apple.y) {
    score += 1;
    eatSound.currentTime = 0;
    eatSound.play().catch(()=>{});

    if (score % 5 === 0) {
      level += 1;
      tickCurrent = Math.max(60, tickBase - level * 15);
    }
    apple = spawnApple();
    updateHUD();
  } else {
    snake.pop();
  }
}

// Desenho
function draw() {
  // fundo simples
  ctx.fillStyle = '#e6eef6';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // maçã
  ctx.fillStyle = '#d93b3b';
  roundRectFill(apple.x * TILE + 2, apple.y * TILE + 2, TILE-4, TILE-4, 4);

  // cobra
  for (let i=0;i<snake.length;i++){
    const s = snake[i];
    ctx.fillStyle = i===0 ? '#14632a' : '#2b8a3e';
    roundRectFill(s.x * TILE + 1, s.y * TILE + 1, TILE-2, TILE-2, 4);
  }

  // overlay game over
  if (gameOver) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '20px system-ui, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 10);
    ctx.font = '14px system-ui, Arial';
    ctx.fillText('Clique ou pressione Espaço para reiniciar', canvas.width/2, canvas.height/2 + 16);

    setTimeout(()=> menu.style.display = 'flex', 1000);
  }
}

// helper
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

// loop
let last = 0;
function loop(ms){
  if (!last) last = ms;
  if (ms - last >= tickCurrent) {
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
  if (e.key.toLowerCase() === 'p') togglePause();
});

function setNextDir(x,y){
  if (x === -dir.x && y === -dir.y) return;
  nextDir = {x,y};
}

// restart canvas
canvas.addEventListener('click', ()=>{ if (gameOver) resetGame(); });

// controles móveis
document.querySelectorAll('#mobile-controls button').forEach(btn=>{
  btn.addEventListener('touchstart', (e)=>{
    e.preventDefault();
    const d = btn.dataset.dir;
    if(d==='up') setNextDir(0,-1);
    if(d==='down') setNextDir(0,1);
    if(d==='left') setNextDir(-1,0);
    if(d==='right') setNextDir(1,0);
  });
  btn.addEventListener('mousedown', ()=>{
    const d = btn.dataset.dir;
    if(d==='up') setNextDir(0,-1);
    if(d==='down') setNextDir(0,1);
    if(d==='left') setNextDir(-1,0);
    if(d==='right') setNextDir(1,0);
  });
});

// pausa
pauseBtn.addEventListener("click", togglePause);
function togglePause() {
  paused = !paused;
  pauseBtn.textContent = paused ? "▶️ Retomar" : "⏸️ Pausar";
}

// botão iniciar (desbloqueia áudio)
startBtn.addEventListener('click', () => {
  menu.style.display = 'none';

  // desbloquear áudio no mobile
  eatSound.play().catch(()=>{});
  moveSound.play().catch(()=>{});
  eatSound.pause();
  moveSound.pause();

  resetGame();
  requestAnimationFrame(loop);
});

