const tarefas = []
const caminhoCritico = []

function criaTarefa(atividade, duracao, dependencias) {
  tarefas.push({
    atividade,
    duracao,
    dependencias,
  })
}

function calculaES(tarefa) {
  const { dependencias } = tarefa

  const dadosDependecias = tarefas.filter(({ atividade }) =>
    dependencias.includes(atividade)
  )

  const efDependencias = dadosDependecias.map(({ ef }) => ef)

  tarefa.es = efDependencias.length ? Math.max(...efDependencias) : 0
}

function calculaEF(tarefa) {
  const { duracao } = tarefa

  tarefa.ef = tarefa.es + duracao
}

function calculaLF(tarefa) {
  const { atividade } = tarefa

  const tarefasSucessoras = tarefas.filter(({ dependencias }) =>
    dependencias.includes(atividade)
  )

  const lsSucessoras = tarefasSucessoras.map(({ ls }) => ls)

  tarefa.lf = lsSucessoras.length ? Math.min(...lsSucessoras) : 0
}

function calculaLS(tarefa) {
  const { lf, duracao } = tarefa

  tarefa.ls = lf - duracao
}

function mapearTarefaCritica(tarefa) {
  const { ef, lf } = tarefa
  tarefa.folga = lf - ef
}

function calcularCaminhoCritico() {
  const caminhoCritico = []
  let auxTarefa = tarefas[0]
  let progress = true

  while (progress) {
    const { folga, atividade } = auxTarefa

    if (folga === 0) {
      caminhoCritico.push(auxTarefa)
    } else {
      break
    }

    const tarefasSucessoras = tarefas.filter(({ dependencias }) =>
      dependencias.includes(atividade)
    )
    auxTarefa = tarefasSucessoras.find((tarefa) => tarefa.folga === 0)

    if (!auxTarefa) break
  }

  console.log(
    `Caminho critico: ${caminhoCritico.map(({ atividade }) => atividade)}`
  )
  console.log(
    `Comprimento (semanas): ${caminhoCritico
      .map(({ duracao }) => duracao)
      .reduce((a, b) => a + b, 0)}`
  )
}

criaTarefa('inicio', 0, [])

// Exemplos
criaTarefa('a', 2, ['inicio'])
criaTarefa('b', 4, ['a'])
criaTarefa('c', 10, ['b'])
criaTarefa('d', 6, ['c'])
criaTarefa('e', 4, ['c'])
criaTarefa('f', 5, ['e'])
criaTarefa('g', 7, ['d'])
criaTarefa('h', 9, ['e', 'g'])
criaTarefa('i', 7, ['c'])
criaTarefa('j', 8, ['f', 'i'])
criaTarefa('k', 4, ['j'])
criaTarefa('l', 5, ['j'])
criaTarefa('m', 2, ['h'])
criaTarefa('n', 6, ['k', 'l'])
criaTarefa('fim', 0, ['m', 'n'])

// criaTarefa('a', 7, ['inicio'])
// criaTarefa('b', 14, ['a'])
// criaTarefa('c', 10, ['a'])
// criaTarefa('d', 7, ['b'])
// criaTarefa('e', 4, ['b', 'c'])
// criaTarefa('f', 7, ['d', 'e'])
// criaTarefa('fim', 0, ['f'])

tarefas.forEach((tarefa) => {
  calculaES(tarefa)
  calculaEF(tarefa)
})

const fim = tarefas[tarefas.length - 1]

fim.ls = fim.es
fim.lf = fim.ef
fim.folga = fim.lf - fim.ef

for (let index = tarefas.length - 2; index >= 0; index -= 1) {
  const tarefa = tarefas[index]

  calculaLF(tarefa)
  calculaLS(tarefa)
  mapearTarefaCritica(tarefa)
}

calcularCaminhoCritico()
