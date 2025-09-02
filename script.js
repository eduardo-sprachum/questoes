// ===============================
// CONFIGURAÇÃO DO FIREBASE
// ===============================
// 👉 Aqui você coloca as suas chaves reais:
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===============================
// FORMULÁRIO
// ===============================
const universidadeSelect = document.getElementById("universidade");
const alternativasContainer = document.getElementById("alternativas-container");
const form = document.getElementById("questaoForm");

// ===============================
// FUNÇÃO PARA GERAR ALTERNATIVAS
// ===============================
function gerarAlternativas() {
  alternativasContainer.innerHTML = "";
  const universidade = universidadeSelect.value;

  if (universidade === "UEM" || universidade === "UEPG") {
    // Modelo somatório
    const limites = universidade === "UEPG" ? [1, 2, 4, 8] : [1, 2, 4, 8, 16];

    limites.forEach(num => {
      const div = document.createElement("div");
      div.innerHTML = `
        <label>${num.toString().padStart(2, "0")}:</label>
        <input type="text" id="alt${num}" required>
        <input type="checkbox" name="corretaSomatorio" value="${num}"> Correta
      `;
      alternativasContainer.appendChild(div);
    });

  } else if (universidade === "UNICENTRO" || universidade === "IFPR") {
    // A-D
    ["A", "B", "C", "D"].forEach(letra => {
      const div = document.createElement("div");
      div.innerHTML = `
        <label>Alternativa ${letra}:</label>
        <input type="text" id="alt${letra}" required>
        <input type="radio" name="correta" value="${letra}"> Correta
      `;
      alternativasContainer.appendChild(div);
    });

  } else if (universidade) {
    // A-E
    ["A", "B", "C", "D", "E"].forEach(letra => {
      const div = document.createElement("div");
      div.innerHTML = `
        <label>Alternativa ${letra}:</label>
        <input type="text" id="alt${letra}" required>
        <input type="radio" name="correta" value="${letra}"> Correta
      `;
      alternativasContainer.appendChild(div);
    });
  }
}

universidadeSelect.addEventListener("change", gerarAlternativas);

// ===============================
// GERAR CÓDIGO DA QUESTÃO
// ===============================
function gerarCodigo(disciplina, numero) {
  const mapDisc = {
    "Arte": "ART",
    "Biologia": "BIO",
    "Educação Física": "EDF",
    "Física": "FIS",
    "Filosofia": "FIL",
    "Geografia": "GEO",
    "História": "HIS",
    "Português": "POR",
    "Inglês": "ING",
    "Espanhol": "ESP",
    "Francês": "FRA",
    "Química": "QUI",
    "Sociologia": "SOC",
    "Matemática": "MAT",
    "Literatura": "LIT"
  };
  return `${mapDisc[disciplina] || "XXX"}${String(numero).padStart(5, "0")}`;
}

// ===============================
// SALVAR QUESTÃO
// ===============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const universidade = document.getElementById("universidade").value;
  const ano = document.getElementById("ano").value;
  const disciplina = document.getElementById("disciplina").value;
  const eixo = document.getElementById("eixo").value;
  const assunto = document.getElementById("assunto").value;
  const enunciado = document.getElementById("enunciado").value;

  if (!universidade || !ano || !disciplina || !eixo || !assunto || !enunciado) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  // Coleta alternativas
  let alternativas = {};
  let corretas = [];

  if (universidade === "UEM" || universidade === "UEPG") {
    // somatório
    document.querySelectorAll('#alternativas-container input[type="text"]').forEach(input => {
      alternativas[input.id] = input.value;
    });
    document.querySelectorAll('input[name="corretaSomatorio"]:checked').forEach(cb => {
      corretas.push(cb.value);
    });

  } else {
    // A-D ou A-E
    document.querySelectorAll('#alternativas-container input[type="text"]').forEach(input => {
      alternativas[input.id] = input.value;
    });
    const c = document.querySelector('input[name="correta"]:checked');
    if (c) corretas.push(c.value);
  }

  if (corretas.length === 0) {
    alert("Selecione pelo menos uma alternativa correta!");
    return;
  }

  try {
    // Gerar código sequencial (poderia ser substituído por contador no banco)
    const codigoQuestao = gerarCodigo(disciplina, Date.now());

    await addDoc(collection(db, "questoes"), {
      codigo: codigoQuestao,
      universidade,
      ano,
      disciplina,
      eixo,
      assunto,
      enunciado,
      alternativas,
      corretas,
      criadoEm: serverTimestamp()
    });

    alert("Questão salva com sucesso!");
    form.reset();
    alternativasContainer.innerHTML = "";
  } catch (error) {
    console.error(error);
    alert("Erro ao salvar questão");
  }
});
