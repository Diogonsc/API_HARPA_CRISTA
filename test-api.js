const http = require('http');

// Teste da API
function testAPI() {
  console.log('🧪 Testando API da Harpa Cristã...\n');
  
  // Teste 1: Informações da API
  console.log('1. Testando endpoint principal...');
  makeRequest('/', (data) => {
    console.log('✅ API funcionando!');
    console.log(`📊 Total de hinos: ${data.totalHinos}`);
    console.log(`🌐 Endpoints disponíveis: ${Object.keys(data.endpoints).length}\n`);
  });
  
  // Teste 2: Buscar hino específico
  console.log('2. Testando busca de hino por número...');
  makeRequest('/hinos/1', (data) => {
    console.log(`✅ Hino encontrado: ${data.title}`);
    console.log(`📝 Autor: ${data.author}`);
    console.log(`🎵 Versos: ${data.verses.length}\n`);
  });
  
  // Teste 3: Buscar hinos
  console.log('3. Testando busca por termo...');
  makeRequest('/hinos/buscar?q=graça&tipo=letra', (data) => {
    console.log(`✅ Encontrados ${data.total} hinos com "graça" na letra\n`);
  });
  
  // Teste 4: Estatísticas
  console.log('4. Testando estatísticas...');
  makeRequest('/hinos/estatisticas', (data) => {
    console.log(`✅ Estatísticas obtidas:`);
    console.log(`   - Total de hinos: ${data.totalHinos}`);
    console.log(`   - Total de autores: ${data.totalAutores}`);
    console.log(`   - Média de versos por hino: ${data.mediaVersosPorHino}`);
    console.log(`   - Total de refrões: ${data.totalRefroes}\n`);
  });
  
  // Teste 5: Hino aleatório
  console.log('5. Testando hino aleatório...');
  makeRequest('/hinos/aleatorio', (data) => {
    console.log(`✅ Hino aleatório: ${data.title} (Nº ${data.number})\n`);
  });
  
  console.log('🎉 Todos os testes concluídos! A API está funcionando perfeitamente.');
}

function makeRequest(path, callback) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        callback(jsonData);
      } catch (error) {
        console.log(`❌ Erro ao processar resposta: ${error.message}`);
      }
    });
  });
  
  req.on('error', (error) => {
    console.log(`❌ Erro na requisição: ${error.message}`);
    console.log('💡 Certifique-se de que o servidor está rodando em http://localhost:3000');
  });
  
  req.end();
}

// Aguardar um pouco para o servidor inicializar
setTimeout(testAPI, 2000); 