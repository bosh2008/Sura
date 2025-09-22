const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const GRAVITY = 0.6;
const FLAP = -10.5;
const PIPE_GAP = 150;
const PIPE_WIDTH = 60;
const BIRD_X = 80;
let birdY = 250;
let birdVelocity = 0;
let pipes = [];
let score = 0;
let highScore = 0;
let running = false;
const flapSound = new Audio('polayadii.mp3');   // Sound to play when tapping/flapping
const hitSound = new Audio('suraa.mp3');     // Sound to play on game over
function resizeCanvas() {
  let scale = Math.min(window.innerWidth/400, window.innerHeight/600, 1);
  canvas.style.transform = `scale(${scale})`;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function resetGame() {
  birdY = 250;
  birdVelocity = 0;
  pipes = [];
  score = 0;
  running = true;
}

function spawnPipe() {
  const topHeight = Math.random() * (canvas.height - PIPE_GAP - 80) + 40;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - PIPE_GAP,
  });
}

function update() {
  if (!running) return;
  birdVelocity += GRAVITY;
  birdY += birdVelocity;
  if (birdY > canvas.height || birdY < 0) running = false;
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 3;
  }
  if (pipes.length && pipes[0].x < -PIPE_WIDTH) {
    pipes.shift();
    score++;
    if (score > highScore) highScore = score;
  }
  if (pipes.length < 3 && (pipes.length === 0 || pipes[pipes.length - 1].x < 200)) {
    spawnPipe();
  }
  for (let p of pipes) {
    if (
      BIRD_X + 30 > p.x && BIRD_X < p.x + PIPE_WIDTH &&
      (birdY < p.top || birdY + 30 > canvas.height - p.bottom)
    ) {
      running = false;
      hitSound.play();
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#39a845";
  for (let p of pipes) {
    ctx.fillRect(p.x, 0, PIPE_WIDTH, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, PIPE_WIDTH, p.bottom);
  }
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(BIRD_X + 15, birdY + 15, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "32px Arial";
  ctx.fillText(`Score: ${score}`, 20, 40);
  ctx.font = "24px Arial";
  ctx.fillText(`High: ${highScore}`, 280, 40);

  if (!running) {
    ctx.font = "48px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Game Over", 85, 220);
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Tap/Space to Restart", 50, 300);
  }
}

function flapAction() {
  if (running) {
    birdVelocity = FLAP;
    flapSound.play();     // Play flap sound
  } else {
    resetGame();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.key === " " || e.key === "ArrowUp") {
    flapAction();
  }
});
canvas.addEventListener('mousedown', flapAction);
canvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  flapAction();
});

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
resetGame();
gameLoop();
