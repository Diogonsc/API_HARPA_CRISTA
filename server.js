const express = require('express');
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

// Servir arquivos estáticos da pasta audio
app.use('/audio', express.static(path.join(__dirname, 'audio')));

// Importar rotas
const hinosRoutes = require('./routes/hinos');

// Usar rotas
app.use('/api/hinos', hinosRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.json({
    message: 'API da Harpa Cristã',
    version: '1.0.0',
    endpoints: {
      '/api/hinos': 'Lista todos os hinos',
      '/api/hinos/:numero': 'Busca hino por número',
      '/api/hinos/buscar': 'Busca hinos por título ou autor',
      '/api/hinos/aleatorio': 'Retorna um hino aleatório',
      '/api/hinos/estatisticas': 'Estatísticas dos hinos',
      '/api/hinos/autor/:autor': 'Busca hinos por autor',
      '/api/hinos/faixa/:inicio/:fim': 'Busca hinos por faixa de números',
      '/audio/:filename': 'Acesso direto aos arquivos de áudio'
    }
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
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
}); 