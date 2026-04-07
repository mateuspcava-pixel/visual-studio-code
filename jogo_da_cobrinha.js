# visual studio code
# java script
let nivel, tamanho, vida, nivelAlcansado, comidas;
let arena, cobra, localisar, comida_pos;

const gradeEl = document.getElementById("grade");

// Iniciar o jogo
function iniciarJogo() {
  nivel = 3;
  tamanho = 1;
  vida = true;
  nivelAlcansado = 0;
  comidas = 0;

  arena = [];
  cobra = [[0,0]];
  localisar = [0,0];
  comida_pos = [];

  criarArena();
  gerarComida();
  atualizarHUD();
  mostrar();
}

// Criar arena/grid
function criarArena() {
  arena = Array.from({length: nivel}, () => Array(nivel).fill(0));
  arena[0][0] = 3; // cabeça
  gradeEl.style.gridTemplateColumns = `repeat(${nivel}, 40px)`;
}

// Gerar comida aleatória
function gerarComida() {
  while (true) {
    let l = Math.floor(Math.random() * nivel);
    let c = Math.floor(Math.random() * nivel);
    if (arena[l][c] === 0) {
      comida_pos = [l, c];
      arena[l][c] = 2;
      break;
    }
  }
}

// Atualizar HUD (Nível, Mapa, Pontos)
function atualizarHUD() {
  document.getElementById("nivel").textContent =
    `Nível: ${nivelAlcansado}`;
  document.getElementById("mapa").textContent =
    `Mapa: ${nivel}x${nivel}`;
  document.getElementById("pontos").textContent =
    `Pontuação: ${comidas}`;
}

// Mostrar a arena na tela
function mostrar() {
  gradeEl.innerHTML = "";
  for (let row = 0; row < nivel; row++) {
    for (let col = 0; col < nivel; col++) {
      const div = document.createElement("div");

      if (arena[row][col] === 0) div.className = "caixote";
      else if (arena[row][col] === 1) div.className = "cobrinha";
      else if (arena[row][col] === 2) div.className = "maca";
      else if (arena[row][col] === 3) div.className = "cabeca";

      gradeEl.appendChild(div);
    }
  }
}

// Movimentação da cobra
function movimento(direcao) {
  if (!vida) return;

  let novaPos = [...localisar];

  if (direcao === "ArrowUp") novaPos[0] = (novaPos[0] - 1 + nivel) % nivel;
  else if (direcao === "ArrowDown") novaPos[0] = (novaPos[0] + 1) % nivel;
  else if (direcao === "ArrowLeft") novaPos[1] = (novaPos[1] - 1 + nivel) % nivel;
  else if (direcao === "ArrowRight") novaPos[1] = (novaPos[1] + 1) % nivel;
  else return;

  // Colisão com o corpo
  if (cobra.some(p => p[0] === novaPos[0] && p[1] === novaPos[1])) {
    alert("Game Over! Mapas ganhos: " + nivelAlcansado);
    vida = false;
    return;
  }

  // Cabeça antiga vira corpo
  arena[localisar[0]][localisar[1]] = 1;

  localisar = novaPos;

  // Comer comida
  if (localisar[0] === comida_pos[0] && localisar[1] === comida_pos[1]) {
    tamanho++;
    comidas++;
    atualizarHUD();

    if (tamanho >= nivel * nivel) {
      alert("Você ganhou o mapa!");
      nivelAlcansado++;
      nivel = Math.floor(nivel + 1);
      tamanho = 1;
      cobra = [[0,0]];
      localisar = [0,0];
      comidas = 0;

      criarArena();
      gerarComida();
      atualizarHUD();
      mostrar();
      return;
    }

    gerarComida();
  }

  cobra.push([...localisar]);

  // Definir cabeça
  arena[localisar[0]][localisar[1]] = 3;

  // Remover cauda
  if (cobra.length > tamanho) {
    const cauda = cobra.shift();
    arena[cauda[0]][cauda[1]] = 0;
  }

  mostrar();
}

// Evento teclado
document.addEventListener("keydown", (e) => {
  if (!vida && e.key === "Enter") {
    iniciarJogo();
  } else {
    movimento(e.key);
  }
});

iniciarJogo();
