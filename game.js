
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

const W = 960;
const H = 540;
const WORLD = 1800;

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let camera = 0;
let letterFound = false;
let gamePaused = false;

const player = {
  x: 100, y: 376, w: 32, h: 54,
  vx: 0, vy: 0, speed: 4,
  jumpPower: -12, grounded: false, direction: 1
};

const keys = { left: false, right: false, jump: false };
const letter = { x: 1330, y: 372 };

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  scale = Math.min(innerWidth / W, innerHeight / H);
  offsetX = (innerWidth - W * scale) / 2;
  offsetY = (innerHeight - H * scale) / 2;
}

window.addEventListener("resize", resize);
resize();

function bindButton(id, key) {
  const button = document.getElementById(id);

  button.addEventListener("pointerdown", e => {
    e.preventDefault();
    keys[key] = true;
    button.setPointerCapture(e.pointerId);
  });

  const release = e => {
    e.preventDefault();
    keys[key] = false;
  };

  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", () => {
    keys[key] = false;
  });
}

bindButton("left", "left");
bindButton("right", "right");
bindButton("jump", "jump");

window.addEventListener("keydown", e => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(e.key)) {
    e.preventDefault();
  }
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
  if (e.key === "ArrowUp" || e.key === " ") keys.jump = true;
  if (e.key === "e" || e.key === "Enter") interact();
});

window.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
  if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
  if (e.key === "ArrowUp" || e.key === " ") keys.jump = false;
});

document.getElementById("interact").addEventListener("click", interact);

document.getElementById("openLetter").addEventListener("click", () => {
  document.getElementById("message").classList.remove("visible");
  document.getElementById("ending").classList.add("visible");
});

document.getElementById("yes").addEventListener("click", () => {
  document.getElementById("answer").textContent = "Миссия принята! ❤️";
});

document.getElementById("later").addEventListener("click", () => {
  document.getElementById("answer").textContent =
    "Хорошо. Предложение остаётся в силе ❤️";
});

function interact() {
  if (gamePaused || letterFound) return;

  const distance = Math.abs(player.x + player.w / 2 - (letter.x + 11));

  if (distance < 100) {
    letterFound = true;
    gamePaused = true;
    document.getElementById("mission").textContent = "Письмо найдено!";
    document.getElementById("message").classList.add("visible");
  }
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, "#17152f");
  gradient.addColorStop(1, "#57365d");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 90; i++) {
    const x = (i * 137 + 30) % W;
    const y = (i * 73 + 20) % 270;
    ctx.fillStyle = i % 3 === 0 ? "#f6c7ee" : "#b9a8df";
    ctx.globalAlpha = 0.35 + Math.sin(Date.now() / 700 + i) * 0.2;
    ctx.fillRect(x, y, 2, 2);
  }

  ctx.globalAlpha = 1;

  ctx.fillStyle = "#f5d9ed";
  ctx.beginPath();
  ctx.arc(780, 115, 43, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#27203d";
  ctx.beginPath();
  ctx.arc(800, 100, 39, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 20; i++) {
    const x = ((i * 115 - camera * 0.25) % 1200 + 1200) % 1200 - 100;
    const height = 100 + (i * 47 % 130);

    ctx.fillStyle = "#292343";
    ctx.fillRect(x, 430 - height, 75, height);

    for (let j = 0; j < 5; j++) {
      for (let k = 0; k < 4; k++) {
        ctx.fillStyle = (i + j + k) % 3 === 0 ? "#e5a2d4" : "#76628f";
        ctx.fillRect(x + 12 + k * 13, 440 - height + j * 24, 5, 7);
      }
    }
  }
}

function drawGround() {
  ctx.fillStyle = "#29203b";
  ctx.fillRect(0, 430, WORLD, 110);

  ctx.fillStyle = "#a45e9e";
  ctx.fillRect(0, 430, WORLD, 5);

  ctx.fillStyle = "#493451";
  for (let x = 0; x < WORLD; x += 40) {
    ctx.fillRect(x, 450, 20, 3);
  }
}

function drawPlayer() {
  const x = player.x;
  const y = player.y;

  ctx.fillStyle = "#120e20aa";
  ctx.fillRect(x + 2, 423, 32, 5);

  ctx.fillStyle = "#30203f";
  ctx.fillRect(x + 6, y + 39, 9, 15);
  ctx.fillRect(x + 19, y + 39, 9, 15);

  ctx.fillStyle = "#e58cc9";
  ctx.fillRect(x + 3, y + 50, 13, 5);
  ctx.fillRect(x + 18, y + 50, 13, 5);

  ctx.fillStyle = "#a75cba";
  ctx.fillRect(x + 3, y + 20, 27, 23);

  ctx.fillStyle = "#f1c3b9";
  ctx.fillRect(x + 5, y + 2, 23, 21);

  ctx.fillStyle = "#49304c";
  ctx.fillRect(x + 3, y, 27, 8);
  ctx.fillRect(x + 2, y + 5, 5, 17);
  ctx.fillRect(x + 24, y + 5, 6, 17);

  ctx.fillStyle = "#30203d";
  ctx.fillRect(x + (player.direction === 1 ? 19 : 10), y + 12, 3, 3);
}

function drawLetter() {
  if (letterFound) return;

  const x = letter.x;
  const y = letter.y;

  ctx.globalAlpha = 0.25 + Math.sin(Date.now() / 250) * 0.1;
  ctx.fillStyle = "#ff9ce9";
  ctx.beginPath();
  ctx.arc(x + 10, y + 12, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#f6d7e9";
  ctx.fillRect(x, y, 23, 17);

  ctx.fillStyle = "#d76db7";
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 11, y + 9);
  ctx.lineTo(x + 23, y);
  ctx.fill();

  ctx.fillStyle = "#a74383";
  ctx.fillRect(x + 9, y + 6, 5, 5);

  if (Math.abs(player.x - letter.x) < 100) {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("НАЖМИ ✦", x + 11, y - 20);
  }
}

function update() {
  if (gamePaused) return;

  player.vx = 0;

  if (keys.left) {
    player.vx = -player.speed;
    player.direction = -1;
  }

  if (keys.right) {
    player.vx = player.speed;
    player.direction = 1;
  }

  if (keys.jump && player.grounded) {
    player.vy = player.jumpPower;
    player.grounded = false;
  }

  player.x += player.vx;
  player.vy += 0.55;
  player.y += player.vy;

  player.x = Math.max(0, Math.min(WORLD - player.w, player.x));

  if (player.y + player.h >= 430) {
    player.y = 430 - player.h;
    player.vy = 0;
    player.grounded = true;
  }

  camera = Math.max(0, Math.min(WORLD - W, player.x - W * 0.4));
}

function draw() {
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  ctx.clearRect(0, 0, W, H);

  drawBackground();

  ctx.save();
  ctx.translate(-camera, 0);

  drawGround();
  drawLetter();
  drawPlayer();

  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
