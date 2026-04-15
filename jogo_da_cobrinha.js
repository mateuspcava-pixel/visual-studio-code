# visual studio code
# java script

let level;
let snake = [];
let food = [];
let dir = "ArrowRight";
let loop;
let alive = true;
let turnMode = false;

let coins = parseInt(localStorage.getItem("coins")) || 0;
let skin = localStorage.getItem("skin") || "padrao";

let shop = {
  neon: { price: 5, unlocked: false },
  fogo: { price: 10, unlocked: false },
  gelo: { price: 15, unlocked: false },
  rainbow: { price: 25, unlocked: false }
};

let savedShop = JSON.parse(localStorage.getItem("shop"));
if (savedShop) shop = savedShop;

const grid = document.getElementById("grade");

/* START */
function start(mode) {
  alive = true;

  document.getElementById("menu").style.display = "none";
  document.getElementById("gameover").textContent = "";
  document.getElementById("restart").style.display = "none";

  if (mode === "facil") {
    level = 4;
    turnMode = true;
  }
  if (mode === "normal") {
    level = 6;
    turnMode = false;
  }
  if (mode === "dificil") {
    level = 8;
    turnMode = false;
  }

  snake = [[Math.floor(level/2), Math.floor(level/2)]];
  dir = "ArrowRight";

  document.body.className = "skin-" + skin;

  spawnFood();
  render();

  clearInterval(loop);
  if (!turnMode) loop = setInterval(step, 180);

  updateShopUI();
}

/* MOVE */
function step() {
  if (!alive) return;
  move();
}

function move() {
  let head = [...snake[snake.length - 1]];

  if (dir === "ArrowUp") head[0]--;
  if (dir === "ArrowDown") head[0]++;
  if (dir === "ArrowLeft") head[1]--;
  if (dir === "ArrowRight") head[1]++;

  head[0] = (head[0] + level) % level;
  head[1] = (head[1] + level) % level;

  if (snake.some(p => p[0] === head[0] && p[1] === head[1])) {
    return gameOver();
  }

  snake.push(head);

  if (head[0] === food[0] && head[1] === food[1]) {
    coins++;
    localStorage.setItem("coins", coins);
    spawnFood();
    checkWin();
  } else {
    snake.shift();
  }

  render();
}

/* CONTROLE */
document.addEventListener("keydown", (e) => {
  if (!alive) return;

  const keys = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];
  if (keys.includes(e.key)) dir = e.key;

  if (turnMode) move();
});

/* FOOD SAFE */
function spawnFood() {
  let ok = false;

  while (!ok) {
    food = [
      Math.floor(Math.random() * level),
      Math.floor(Math.random() * level)
    ];

    ok = !snake.some(p => p[0] === food[0] && p[1] === food[1]);
  }
}

/* SKIN SHOP */
function setSkin(s) {

  if (s !== "padrao") {
    if (!shop[s].unlocked) {
      if (coins < shop[s].price) {
        alert("❌ Sem moedas!");
        return;
      }

      coins -= shop[s].price;
      shop[s].unlocked = true;

      localStorage.setItem("coins", coins);
      localStorage.setItem("shop", JSON.stringify(shop));
    }
  }

  skin = s;
  localStorage.setItem("skin", skin);

  document.body.className = "skin-" + skin;

  updateShopUI();
}
/* SHOP UI */
function updateShopUI() {
  document.getElementById("info").innerText =
    `💰 Coins: ${coins} | Skin: ${skin}`;

  for (let k in shop) {
    const btn = document.querySelector(`[onclick="setSkin('${k}')"]`);
    if (!btn) continue;

    btn.innerText = shop[k].unlocked ? k + " ✔" : k + " (" + shop[k].price + "💰)";
  }
}

/* WIN */
function checkWin() {
  if (snake.length >= level * level) {
    alert("🏆 Você venceu!");

    level = Math.min(level + 2, 14);

    snake = [[Math.floor(level/2), Math.floor(level/2)]];
    dir = "ArrowRight";

    spawnFood();
    render();

    clearInterval(loop);
    if (!turnMode) loop = setInterval(step, 180);
  }
}

/* RENDER FIX TOTAL */
function render() {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${level}, 26px)`;

  for (let r = 0; r < level; r++) {
    for (let c = 0; c < level; c++) {

      const cell = document.createElement("div");
      cell.className = "caixa";

      if (food[0] === r && food[1] === c) {
        cell.className = "comida";
      }

      for (let i = 0; i < snake.length; i++) {
        if (snake[i][0] === r && snake[i][1] === c) {
          cell.className = (i === snake.length - 1) ? "cabeca" : "cobra";
          break;
        }
      }

      grid.appendChild(cell);
    }
  }

  updateShopUI();
}

/* GAME OVER */
function gameOver() {
  alive = false;
  clearInterval(loop);
  document.getElementById("gameover").innerText = "💀 Game Over";
  document.getElementById("restart").style.display = "block";
}

/* RESTART */
function restart() {
  document.getElementById("menu").style.display = "inline-block";
  document.getElementById("restart").style.display = "none";
}
