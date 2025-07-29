const http = require('http');

// Função para fazer requisições HTTP
function makeRequest(path) {
  return new Promise((resolve, reject) => {
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
          resolve(jsonData);
        } catch (error) {
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Testes
async function testAPI() {
  console.log('🧪 Testando API da Harpa Cristã...\n');

  try {
    // Teste 1: Rota principal
    console.log('1. Testando rota principal...');
    const main = await makeRequest('/');
    console.log('✅ Rota principal:', main.message);
    console.log('');

    // Teste 2: Listar hinos (primeira página)
    console.log('2. Testando listagem de hinos...');
    const hinos = await makeRequest('/api/hinos');
    console.log(`✅ Hinos encontrados: ${hinos.hinos.length}`);
    console.log(`✅ Total de hinos: ${hinos.paginacao.total}`);
    console.log('');

    // Teste 3: Buscar hino específico
    console.log('3. Testando busca por número...');
    const hino1 = await makeRequest('/api/hinos/1');
    console.log(`✅ Hino 1: ${hino1.title}`);
    console.log(`✅ Autor: ${hino1.author}`);
    console.log(`✅ Versos: ${hino1.verses.length}`);
    console.log('');

    // Teste 4: Busca por termo
    console.log('4. Testando busca por termo...');
    const busca = await makeRequest('/api/hinos/buscar?q=graça');
    console.log(`✅ Resultados para "graça": ${busca.total}`);
    console.log('');

    // Teste 5: Hino aleatório
    console.log('5. Testando hino aleatório...');
    const aleatorio = await makeRequest('/api/hinos/aleatorio');
    console.log(`✅ Hino aleatório: ${aleatorio.title} (${aleatorio.number})`);
    console.log('');

    // Teste 6: Estatísticas
    console.log('6. Testando estatísticas...');
    const stats = await makeRequest('/api/hinos/estatisticas');
    console.log(`✅ Total de hinos: ${stats.totalHinos}`);
    console.log(`✅ Total de autores: ${stats.totalAutores}`);
    console.log(`✅ Média de versos: ${stats.mediaVersosPorHino}`);
    console.log('');

    console.log('🎉 Todos os testes passaram com sucesso!');

  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
  }
}

testAPI(); 