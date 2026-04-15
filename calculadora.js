let tela = document.getElementById("tela");

// adiciona valores na tela
function adicionar(valor) {
  tela.value += valor;
}

// limpa tudo
function limpar() {
  tela.value = "";
}

// apaga último caractere
function apagar() {
  tela.value = tela.value.slice(0, -1);
}

// calcula resultado sem eval direto (mais seguro)
function calcular() {
  try {
    let expressao = tela.value;

    // troca símbolos visuais se quiser
    expressao = expressao.replace(/×/g, "*");
    expressao = expressao.replace(/÷/g, "/");

    let resultado = Function("return " + expressao)();

    tela.value = resultado;
  } catch (erro) {
    tela.value = "Erro";
  }
}
