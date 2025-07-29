const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Carregar dados dos hinos
let hinos = [];
try {
  const data = fs.readFileSync(path.join(__dirname, '..', 'hinos.json'), 'utf8');
  hinos = JSON.parse(data);
  console.log(`✅ ${hinos.length} hinos carregados com sucesso`);
} catch (error) {
  console.error('❌ Erro ao carregar hinos.json:', error);
  hinos = [];
}

const { adicionarUrlAudio } = require('../utils/helpers');

// Listar todos os hinos
router.get('/', (req, res) => {
  const { page = 1, limit = 20, sort = 'number' } = req.query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  let sortedhinos = [...hinos];
  if (sort === 'title') {
    sortedhinos.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'author') {
    sortedhinos.sort((a, b) => a.author.localeCompare(b.author));
  } else {
    sortedhinos.sort((a, b) => a.number - b.number);
  }
  
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  const paginatedhinos = sortedhinos.slice(startIndex, endIndex);
  
  const hinosComAudio = paginatedhinos.map(hino => {
    const hinoComAudio = { ...hino };
    if (hinoComAudio.audio) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      hinoComAudio.audioUrl = `${baseUrl}/${hinoComAudio.audio}`;
    }
    return hinoComAudio;
  });
  
  res.json({
    hinos: hinosComAudio,
    paginacao: {
      pagina: pageNum,
      porPagina: limitNum,
      total: hinos.length,
      totalPaginas: Math.ceil(hinos.length / limitNum)
    }
  });
});

// Buscar hinos por título ou autor
router.get('/buscar', (req, res) => {
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
  
  const hinosUnicos = resultados.filter((hino, index, self) => 
    index === self.findIndex(h => h.number === hino.number)
  );
  
  const hinosComAudio = hinosUnicos.map(hino => {
    const hinoComAudio = { ...hino };
    if (hinoComAudio.audio) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      hinoComAudio.audioUrl = `${baseUrl}/${hinoComAudio.audio}`;
    }
    return hinoComAudio;
  });
  
  res.json({
    termo: q,
    tipo: tipo,
    total: hinosComAudio.length,
    hinos: hinosComAudio
  });
});

// Hino aleatório
router.get('/aleatorio', (req, res) => {
  const hinoAleatorio = { ...hinos[Math.floor(Math.random() * hinos.length)] };
  
  if (hinoAleatorio.audio) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    hinoAleatorio.audioUrl = `${baseUrl}/${hinoAleatorio.audio}`;
  }
  
  res.json(hinoAleatorio);
});

// Estatísticas dos hinos
router.get('/estatisticas', (req, res) => {
  const totalHinos = hinos.length;
  const autores = [...new Set(hinos.map(h => h.author))];
  
  const hinoMaisVersos = hinos.reduce((max, hino) => 
    hino.verses.length > max.verses.length ? hino : max
  );
  
  const hinoMenosVersos = hinos.reduce((min, hino) => 
    hino.verses.length < min.verses.length ? hino : min
  );
  
  const totalVersos = hinos.reduce((sum, hino) => sum + hino.verses.length, 0);
  const mediaVersos = (totalVersos / totalHinos).toFixed(2);
  
  const totalRefroes = hinos.reduce((sum, hino) => 
    sum + hino.verses.filter(v => v.chorus).length, 0
  );
  
  const hinosComAudio = hinos.filter(h => h.audio).length;
  
  res.json({
    totalHinos,
    totalAutores: autores.length,
    autores: autores,
    mediaVersosPorHino: parseFloat(mediaVersos),
    totalVersos,
    totalRefroes,
    hinosComAudio,
    percentualComAudio: ((hinosComAudio / totalHinos) * 100).toFixed(2),
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
router.get('/:numero', (req, res) => {
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
  
  const hinoComAudio = { ...hino };
  if (hinoComAudio.audio) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    hinoComAudio.audioUrl = `${baseUrl}/${hinoComAudio.audio}`;
  }
  
  res.json(hinoComAudio);
});

// Buscar hinos por autor específico
router.get('/autor/:autor', (req, res) => {
  const autor = req.params.autor.toLowerCase();
  const hinosDoAutor = hinos.filter(h => 
    h.author.toLowerCase().includes(autor)
  );
  
  const hinosComAudio = hinosDoAutor.map(hino => {
    const hinoComAudio = { ...hino };
    if (hinoComAudio.audio) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      hinoComAudio.audioUrl = `${baseUrl}/${hinoComAudio.audio}`;
    }
    return hinoComAudio;
  });
  
  res.json({
    autor: req.params.autor,
    total: hinosComAudio.length,
    hinos: hinosComAudio
  });
});

// Buscar hinos por faixa de números
router.get('/faixa/:inicio/:fim', (req, res) => {
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
  
  const hinosComAudio = hinosNaFaixa.map(hino => {
    const hinoComAudio = { ...hino };
    if (hinoComAudio.audio) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      hinoComAudio.audioUrl = `${baseUrl}/${hinoComAudio.audio}`;
    }
    return hinoComAudio;
  });
  
  res.json({
    faixa: `${inicio} - ${fim}`,
    total: hinosComAudio.length,
    hinos: hinosComAudio
  });
});

module.exports = router; 