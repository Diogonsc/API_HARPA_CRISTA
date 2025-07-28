const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing JSON
app.use(express.json());

// Middleware para CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Carregar dados dos hinos
let hinos = [];
try {
  const data = fs.readFileSync(path.join(__dirname, 'hinos.json'), 'utf8');
  hinos = JSON.parse(data);
  console.log(`✅ ${hinos.length} hinos carregados com sucesso`);
} catch (error) {
  console.error('❌ Erro ao carregar hinos.json:', error);
  // Em caso de erro, inicializar com array vazio para evitar crashes
  hinos = [];
}

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'API da Harpa Cristã',
    version: '1.0.0',
    totalHinos: hinos.length,
    endpoints: {
      '/hinos': 'Lista todos os hinos',
      '/hinos/:numero': 'Busca hino por número',
      '/hinos/buscar': 'Busca hinos por título ou autor',
      '/hinos/aleatorio': 'Retorna um hino aleatório',
      '/hinos/estatisticas': 'Estatísticas dos hinos'
    }
  });
});

// Listar todos os hinos
app.get('/hinos', (req, res) => {
  const { page = 1, limit = 20, sort = 'number' } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  // Ordenar hinos
  let sortedhinos = [...hinos];
  if (sort === 'title') {
    sortedhinos.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'author') {
    sortedhinos.sort((a, b) => a.author.localeCompare(b.author));
  } else {
    sortedhinos.sort((a, b) => a.number - b.number);
  }
  
  // Paginação
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedhinos = sortedhinos.slice(startIndex, endIndex);
  
  res.json({
    hinos: paginatedhinos,
    paginacao: {
      pagina: pageNum,
      porPagina: limitNum,
      total: hinos.length,
      totalPaginas: Math.ceil(hinos.length / limitNum)
    }
  });
});

// Buscar hinos por título ou autor
app.get('/hinos/buscar', (req, res) => {
  const { q, tipo = 'todos' } = req.query;
  
  if (!q) {
    return res.status(400).json({ 
      error: 'Parâmetro de busca "q" é obrigatório' 
    });
  }
  
  const termo = q.toLowerCase();
  let resultados = [];
  
  if (tipo === 'titulo' || tipo === 'todos') {
    const porTitulo = hinos.filter(h => 
      h.title.toLowerCase().includes(termo)
    );
    resultados.push(...porTitulo);
  }
  
  if (tipo === 'autor' || tipo === 'todos') {
    const porAutor = hinos.filter(h => 
      h.author.toLowerCase().includes(termo)
    );
    resultados.push(...porAutor);
  }
  
  if (tipo === 'letra' || tipo === 'todos') {
    const porLetra = hinos.filter(h => 
      h.verses.some(v => v.lyrics.toLowerCase().includes(termo))
    );
    resultados.push(...porLetra);
  }
  
  // Remover duplicatas
  const hinosUnicos = resultados.filter((hino, index, self) => 
    index === self.findIndex(h => h.number === hino.number)
  );
  
  res.json({
    termo: q,
    tipo: tipo,
    total: hinosUnicos.length,
    hinos: hinosUnicos
  });
});

// Hino aleatório
app.get('/hinos/aleatorio', (req, res) => {
  const hinoAleatorio = hinos[Math.floor(Math.random() * hinos.length)];
  res.json(hinoAleatorio);
});

// Estatísticas dos hinos
app.get('/hinos/estatisticas', (req, res) => {
  const totalHinos = hinos.length;
  
  // Contar autores únicos
  const autores = [...new Set(hinos.map(h => h.author))];
  
  // Hino com mais versos
  const hinoMaisVersos = hinos.reduce((max, hino) => 
    hino.verses.length > max.verses.length ? hino : max
  );
  
  // Hino com menos versos
  const hinoMenosVersos = hinos.reduce((min, hino) => 
    hino.verses.length < min.verses.length ? hino : min
  );
  
  // Média de versos por hino
  const totalVersos = hinos.reduce((sum, hino) => sum + hino.verses.length, 0);
  const mediaVersos = (totalVersos / totalHinos).toFixed(2);
  
  // Contar refrões
  const totalRefroes = hinos.reduce((sum, hino) => 
    sum + hino.verses.filter(v => v.chorus).length, 0
  );
  
  res.json({
    totalHinos,
    totalAutores: autores.length,
    autores: autores,
    mediaVersosPorHino: parseFloat(mediaVersos),
    totalVersos,
    totalRefroes,
    hinoComMaisVersos: {
      numero: hinoMaisVersos.number,
      titulo: hinoMaisVersos.title,
      totalVersos: hinoMaisVersos.verses.length
    },
    hinoComMenosVersos: {
      numero: hinoMenosVersos.number,
      titulo: hinoMenosVersos.title,
      totalVersos: hinoMenosVersos.verses.length
    }
  });
});

// Buscar hino por número
app.get('/hinos/:numero', (req, res) => {
  const numero = parseInt(req.params.numero);
  
  if (isNaN(numero)) {
    return res.status(400).json({ 
      error: 'Número do hino deve ser um valor numérico' 
    });
  }
  
  const hino = hinos.find(h => h.number === numero);
  
  if (!hino) {
    return res.status(404).json({ 
      error: `Hino número ${numero} não encontrado` 
    });
  }
  
  res.json(hino);
});

// Rota para buscar hinos por autor específico
app.get('/hinos/autor/:autor', (req, res) => {
  const autor = req.params.autor.toLowerCase();
  const hinosDoAutor = hinos.filter(h => 
    h.author.toLowerCase().includes(autor)
  );
  
  res.json({
    autor: req.params.autor,
    total: hinosDoAutor.length,
    hinos: hinosDoAutor
  });
});

// Rota para buscar hinos por faixa de números
app.get('/hinos/faixa/:inicio/:fim', (req, res) => {
  const inicio = parseInt(req.params.inicio);
  const fim = parseInt(req.params.fim);
  
  if (isNaN(inicio) || isNaN(fim)) {
    return res.status(400).json({ 
      error: 'Início e fim devem ser valores numéricos' 
    });
  }
  
  if (inicio > fim) {
    return res.status(400).json({ 
      error: 'Início deve ser menor ou igual ao fim' 
    });
  }
  
  const hinosNaFaixa = hinos.filter(h => 
    h.number >= inicio && h.number <= fim
  );
  
  res.json({
    faixa: `${inicio} - ${fim}`,
    total: hinosNaFaixa.length,
    hinos: hinosNaFaixa
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: 'Consulte a documentação em / para ver os endpoints disponíveis'
  });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: 'Ocorreu um erro inesperado'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API da Harpa Cristã rodando na porta ${PORT}`);
  console.log(`📊 Total de hinos carregados: ${hinos.length}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
}); 