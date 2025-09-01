const universidadeSelect = document.getElementById("universidade");
const alternativasContainer = document.getElementById("alternativasContainer");
const disciplinaSelect = document.getElementById("disciplina");
const eixoSelect = document.getElementById("eixo");
const assuntoSelect = document.getElementById("assunto");

// 🔹 Alternativas padrão (A–E)
const alternativasPadrao = `
  <label>Alternativa A:</label>
  <input type="text" id="altA" required>
  <label>Alternativa B:</label>
  <input type="text" id="altB" required>
  <label>Alternativa C:</label>
  <input type="text" id="altC" required>
  <label>Alternativa D:</label>
  <input type="text" id="altD" required>
  <label>Alternativa E:</label>
  <input type="text" id="altE" required>
`;

// 🔹 Modelo somatório (UEM / UEPG)
const alternativasSomatorio = (uni) => `
  <label>01:</label>
  <input type="text" id="alt01" required>
  <label>02:</label>
  <input type="text" id="alt02" required>
  <label>04:</label>
  <input type="text" id="alt04" required>
  <label>08:</label>
  <input type="text" id="alt08" required>
  <label>16:</label>
  <input type="text" id="alt16" ${uni === "UEPG" ? "" : "required"}>
`;

// 🔹 Troca dinamicamente as alternativas
universidadeSelect.addEventListener("change", () => {
  const uni = universidadeSelect.value;
  if (uni === "UEM" || uni === "UEPG") {
    alternativasContainer.innerHTML = alternativasSomatorio(uni);
  } else {
    alternativasContainer.innerHTML = alternativasPadrao;
  }
});

// 🔹 Cascata Disciplina → Eixo Temático
const opcoesEixo = {
  "Matemática": ["Matemática Básica", "Conjuntos", "Funções", "Módulo", "Exponencial", "Logaritmo", "Geometria Plana", "Trigonometria", "Geometria Espacial", "Geometria Analítica", "Matrizes", "Determinantes", "Sistemas Lineares", "Sequências e Progressões", "Análise Combinatória", "Probabilidade", "Estatística", "Números Complexos", "Polinômios", "Mista"],
  "Biologia": ["Introdução à Biologia", "Bioquímica", "Citologia", "Bioenergética", "Histologia", "Reprodução", "Embriologia", "Taxonomia", "Microbiologia", "Micologia", "Botânica", "Zoologia", "Fisiologia Humana", "Genética", "Biotecnologia", "Evolução", "Ecologia", "Mista"],
  "Física": ["Introdução à Física", "Cinemática", "Dinâmica", "Estática", "Gravitação Universal", "Trabalho e Energia", "Quantidade de Movimento", "Movimento Circular", "Fluidos", "MHS", "Termologia", "Ondulatória", "Óptica", "Eletrostática", "Eletrodinâmica", "Magnetismo", "Física Moderna", "Análise Dimensional", "Mista"]
};

disciplinaSelect.addEventListener("change", () => {
  const disciplina = disciplinaSelect.value;
  eixoSelect.innerHTML = "<option value=''>Selecione</option>";

  if (opcoesEixo[disciplina]) {
    opcoesEixo[disciplina].forEach(e => {
      const opt = document.createElement("option");
      opt.value = e;
      opt.textContent = e;
      eixoSelect.appendChild(opt);
    });
  }
});

// 🔹 Cascata Eixo → Assunto
const opcoesAssunto = {
  "Álgebra": ["Equações", "Sistemas", "Polinômios"],
  "Ecologia": ["Cadeias alimentares", "Ciclos biogeoquímicos"],
  // ➝ aqui você também vai preencher
};

eixoSelect.addEventListener("change", () => {
  const eixo = eixoSelect.value;
  assuntoSelect.innerHTML = "<option value=''>Selecione</option>";

  if (opcoesAssunto[eixo]) {
    opcoesAssunto[eixo].forEach(a => {
      const opt = document.createElement("option");
      opt.value = a;
      opt.textContent = a;
      assuntoSelect.appendChild(opt);
    });
  }
});
