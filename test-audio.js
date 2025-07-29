const http = require('http');

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

async function testAudioField() {
  console.log('🧪 Testando mudança do campo audio para audioUrl...\n');

  try {
    // Teste 1: Buscar hino específico
    console.log('1. Testando hino 1...');
    const hino1 = await makeRequest('/api/hinos/1');
    
    console.log('✅ Título:', hino1.title);
    console.log('✅ Autor:', hino1.author);
    console.log('✅ Número:', hino1.number);
    
    // Verificar se o campo audio foi removido
    if (hino1.audio === undefined) {
      console.log('✅ Campo "audio" foi removido');
    } else {
      console.log('❌ Campo "audio" ainda existe:', hino1.audio);
    }
    
    // Verificar se o campo audioUrl existe
    if (hino1.audioUrl) {
      console.log('✅ Campo "audioUrl" existe:', hino1.audioUrl);
    } else {
      console.log('❌ Campo "audioUrl" não existe');
    }
    console.log('');

    // Teste 2: Listar hinos
    console.log('2. Testando listagem de hinos...');
    const hinos = await makeRequest('/api/hinos?limit=3');
    
    console.log(`✅ Hinos retornados: ${hinos.hinos.length}`);
    
    // Verificar o primeiro hino da lista
    const primeiroHino = hinos.hinos[0];
    if (primeiroHino.audio === undefined) {
      console.log('✅ Campo "audio" removido da listagem');
    } else {
      console.log('❌ Campo "audio" ainda existe na listagem');
    }
    
    if (primeiroHino.audioUrl) {
      console.log('✅ Campo "audioUrl" presente na listagem');
    } else {
      console.log('❌ Campo "audioUrl" não existe na listagem');
    }
    console.log('');

    // Teste 3: Hino aleatório
    console.log('3. Testando hino aleatório...');
    const aleatorio = await makeRequest('/api/hinos/aleatorio');
    
    if (aleatorio.audio === undefined) {
      console.log('✅ Campo "audio" removido do hino aleatório');
    } else {
      console.log('❌ Campo "audio" ainda existe no hino aleatório');
    }
    
    if (aleatorio.audioUrl) {
      console.log('✅ Campo "audioUrl" presente no hino aleatório');
    } else {
      console.log('❌ Campo "audioUrl" não existe no hino aleatório');
    }
    console.log('');

    console.log('🎉 Teste concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testAudioField(); 