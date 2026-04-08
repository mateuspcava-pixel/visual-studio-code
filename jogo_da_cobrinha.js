# visual studio code
# java script
// ===============================
// Variáveis do jogo
// ===============================
let nivel, tamanho, vida, nivelAlcansado, comidas;
let arena = [];
let cobra = [];
let posicaoCobra = [];
let comida_pos = [];
let modo = "";
let loopJogo;

let direcaoAtual = "ArrowRight"; // começa andando
let proximaDirecao = "";

const direcoesOpostas = {
  ArrowUp: "ArrowDown",
  ArrowDown: "ArrowUp",
  ArrowLeft: "ArrowRight",
  ArrowRight: "ArrowLeft"
};

const gradeEl = document.getElementById("grade");

// ===============================
// Máximos por dificuldade
// ===============================
const maximos = {
  facil: { nivel: 3, tamanho: 1, nivelAlcansado: 0, comidas: 0 },
  normal: { nivel: 5, tamanho: 1, nivelAlcansado: 0, comidas: 0 },
  dificil: { nivel: 8, tamanho: 1, nivelAlcansado: 0, comidas: 0 }
};

// ===============================
// BOTÕES DE MODO (CORREÇÃO)
// ===============================
function facil() { modo = "facil"; }
function normal() { modo = "normal"; }
function dificil() { modo = "dificil"; }

// ===============================
// Reiniciar
// ===============================
function reiniciar() {
  document.getElementById("derota").textContent = "";
  document.getElementById("vitoria").textContent = "";

  modo = "";
  vida = false;
  clearInterval(loopJogo);

  document.getElementById("menu").style.display = "block";
  document.getElementById("iniciarjogo").style.display = "block";
  document.getElementById("reiniciar").style.display = "none";
}

document.getElementById("reiniciar").style.display = "none";

// ===============================
// Iniciar jogo
// ===============================
function iniciarJogo() {
  if (!modo) return;

  document.getElementById("menu").style.display = "none";
  document.getElementById("reiniciar").style.display = "none";
  document.getElementById("iniciarjogo").style.display = "none";

  tamanho = 1;
  vida = true;
  nivelAlcansado = 0;
  comidas = 0;
  arena = [];
  cobra = [[0,0]];
  posicaoCobra = [0,0];
  comida_pos = [];

  direcaoAtual = "ArrowRight";
  proximaDirecao = "";

  nivel = maximos[modo].nivel;

  criarArena();
  gerarComida();
  atualizarHUD();
  mostrar();

  clearInterval(loopJogo);

  // ===============================
  // LOOP FUNCIONANDO EM TODOS MODOS
  // ===============================
  if (modo === "normal") loopJogo = setInterval(jogoLoop, 600);
  else if (modo === "dificil") loopJogo = setInterval(jogoLoop, 400);
}

// ===============================
// Criar arena
// ===============================
function criarArena() {
  arena = Array.from({ length: nivel }, () => Array(nivel).fill(0));
  arena[0][0] = 3;
  gradeEl.style.gridTemplateColumns = `repeat(${nivel}, 40px)`;
}

// ===============================
// Gerar comida
// ===============================
function gerarComida() {
  while(true){
    let l = Math.floor(Math.random()*nivel);
    let c = Math.floor(Math.random()*nivel);

    if(arena[l][c] === 0){
      comida_pos = [l,c];
      arena[l][c] = 2;
      break;
    }
  }
}

// ===============================
// HUD
// ===============================
function atualizarHUD(){
  const m = maximos[modo];

  document.getElementById("nivel").textContent =
    `Nível: ${nivelAlcansado}`;

  document.getElementById("mapa").textContent =
    `Mapa: ${nivel}x${nivel}`;

  document.getElementById("pontos").textContent =
    `Pontuação: ${comidas}`;

  document.getElementById("tamanho").textContent =
    `Tamanho: ${tamanho}`;
}

// ===============================
// Renderização
// ===============================
function mostrar() {
  gradeEl.innerHTML = "";

  for(let row=0; row<nivel; row++){
    for(let col=0; col<nivel; col++){
      const div = document.createElement("div");

      switch(arena[row][col]){
        case 0: div.className="caixote"; break;
        case 1: div.className="cobrinha"; break;
        case 2: div.className="maca"; break;
        case 3: div.className="cabeca"; break;
      }

      gradeEl.appendChild(div);
    }
  }
}

// ===============================
// Movimento
// ===============================
function movimento(direcao, wrap=false){
  if(!vida || direcao==="") return;

  let novaPos=[...posicaoCobra];

  switch(direcao){
    case "ArrowUp": novaPos[0]-=1; break;
    case "ArrowDown": novaPos[0]+=1; break;
    case "ArrowLeft": novaPos[1]-=1; break;
    case "ArrowRight": novaPos[1]+=1; break;
  }

  if(wrap){
    novaPos[0]=(novaPos[0]+nivel)%nivel;
    novaPos[1]=(novaPos[1]+nivel)%nivel;
  } else if(
    novaPos[0]<0 || novaPos[0]>=nivel ||
    novaPos[1]<0 || novaPos[1]>=nivel
  ){
    document.getElementById("derota").textContent="Game Over!";
    vida=false;
    clearInterval(loopJogo);
    document.getElementById("reiniciar").style.display="block";
    return;
  }

  // colisão com corpo
  if(cobra.some(p=>p[0]===novaPos[0] && p[1]===novaPos[1])){
    document.getElementById("derota").textContent="Game Over!";
    vida=false;
    clearInterval(loopJogo);
    document.getElementById("reiniciar").style.display="block";
    return;
  }

  arena[posicaoCobra[0]][posicaoCobra[1]]=1;
  posicaoCobra=novaPos;

  // comer
  if(posicaoCobra[0]===comida_pos[0] && posicaoCobra[1]===comida_pos[1]){
    tamanho++;
    comidas++;

    if(tamanho>=nivel*nivel){
      document.getElementById("vitoria").textContent="Você ganhou!";

      tamanho=1;
      cobra=[[0,0]];
      posicaoCobra=[0,0];

      // crescimento controlado
      if(modo==="facil") nivel++;
      else if(modo==="normal") nivel=Math.floor(nivel*1.25);
      else if(modo==="dificil") nivel=Math.min(20, Math.floor(nivel*1.5));

      criarArena();
      gerarComida();
      return;
    } else {
      gerarComida();
    }
  }

  cobra.push([...posicaoCobra]);
  arena[posicaoCobra[0]][posicaoCobra[1]]=3;

  if(cobra.length>tamanho){
    const cauda=cobra.shift();
    arena[cauda[0]][cauda[1]]=0;
  }

  atualizarHUD();
  mostrar();
}

// ===============================
// Loop
// ===============================
function jogoLoop(){
  if(proximaDirecao){
    direcaoAtual=proximaDirecao;
    proximaDirecao="";
  }

  movimento(direcaoAtual, modo==="facil" || modo==="normal");
}

// ===============================
// Teclado
// ===============================
document.addEventListener("keydown",(e)=>{
  if(!vida) return;

  if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) return;

  if(direcoesOpostas[e.key]===direcaoAtual) return;

  // MODO FÁCIL: anda na hora
  if(modo === "facil"){
    direcaoAtual = e.key;
    movimento(e.key, true);
    return;
  }

  // outros modos (com delay)
  proximaDirecao = e.key;
});

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
