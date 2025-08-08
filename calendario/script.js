// Função para carregar o arquivo ferias.yaml e processar os dados
async function carregarFerias() {
  const response = await fetch('../ferias.yaml');
  const yamlText = await response.text();
  const data = jsyaml.load(yamlText);

  const funcionarios = data.funcionarios;
  desenharCalendario(funcionarios);
}

// Função para verificar se dois períodos se sobrepõem
function haConflito(a, b) {
  return a.inicio <= b.fim && b.inicio <= a.fim;
}

// Função para desenhar o calendário por funcionário e marcar conflitos
function desenharCalendario(funcionarios) {
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';

  // Montar períodos por datas para ver conflitos
  let periodos = [];
  funcionarios.forEach((f, idx) => {
    f.periodos.forEach((p, i) => {
      periodos.push({
        funcionario: f.nome,
        inicio: new Date(p.inicio),
        fim: new Date(p.fim),
        idxFuncionario: idx,
        idxPeriodo: i
      });
    });
  });

  // Detectar conflitos
  let conflitos = new Set();
  for (let i = 0; i < periodos.length; i++) {
    for (let j = i+1; j < periodos.length; j++) {
      if (haConflito(periodos[i], periodos[j])) {
        conflitos.add(`${periodos[i].idxFuncionario}-${periodos[i].idxPeriodo}`);
        conflitos.add(`${periodos[j].idxFuncionario}-${periodos[j].idxPeriodo}`);
      }
    }
  }

  // Exibir por funcionário
  funcionarios.forEach((f, idxFuncionario) => {
    const row = document.createElement('div');
    row.className = 'employee-row';
    const name = document.createElement('span');
    name.className = 'employee-name';
    name.textContent = f.nome + ':';
    row.appendChild(name);

    f.periodos.forEach((p, idxPeriodo) => {
      const per = document.createElement('span');
      per.className = 'period';
      if (conflitos.has(`${idxFuncionario}-${idxPeriodo}`)) {
        per.classList.add('conflict');
        per.textContent = `${p.inicio} a ${p.fim} (Conflito)`;
      } else {
        per.textContent = `${p.inicio} a ${p.fim}`;
      }
      row.appendChild(per);
    });

    calendar.appendChild(row);
  });
}

// Carrega a lib js-yaml para ler YAML no browser
function carregarJsYaml(callback) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js';
  script.onload = callback;
  document.head.appendChild(script);
}

carregarJsYaml(carregarFerias);
