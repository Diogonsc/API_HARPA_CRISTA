# API da Harpa Cristã

API REST para acessar hinos da Harpa Cristã com arquivos de áudio.

## 🚀 Endpoints

### Hinos

- `GET /hinos` - Lista todos os hinos (com paginação)
- `GET /hinos/:numero` - Busca hino por número
- `GET /hinos/buscar?q=termo` - Busca hinos por título, autor ou letra
- `GET /hinos/aleatorio` - Retorna um hino aleatório
- `GET /hinos/estatisticas` - Estatísticas dos hinos
- `GET /hinos/autor/:autor` - Busca hinos por autor específico
- `GET /hinos/faixa/:inicio/:fim` - Busca hinos por faixa de números

### Áudios

- `GET /audios` - Lista todos os arquivos de áudio disponíveis
- `GET /audios/hino/:numero` - Busca áudio por número do hino
- `GET /audios/aleatorio` - Retorna um áudio aleatório
- `GET /audio/:filename` - Acesso direto aos arquivos de áudio

## 📋 Exemplos de Uso

### Listar todos os áudios
```bash
curl http://localhost:3000/audios
```

### Buscar áudio do hino 1
```bash
curl http://localhost:3000/audios/hino/1
```

### Áudio aleatório
```bash
curl http://localhost:3000/audios/aleatorio
```

### Acessar arquivo de áudio diretamente
```bash
curl http://localhost:3000/audio/1-chuvasdegraca.mp3
```

## 🎵 Formato de Resposta dos Áudios

### Lista de Áudios (`/audios`)
```json
{
  "total": 400,
  "audios": [
    {
      "filename": "1-chuvasdegraca.mp3",
      "url": "http://localhost:3000/audio/1-chuvasdegraca.mp3",
      "size": 2048576,
      "sizeFormatted": "2.00 MB",
      "numeroHino": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "modifiedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "estatisticas": {
    "totalSize": 819430400,
    "totalSizeFormatted": "781.25 MB",
    "mediaSize": "2.05 MB"
  }
}
```

### Áudio por Número (`/audios/hino/:numero`)
```json
{
  "numeroHino": 1,
  "filename": "1-chuvasdegraca.mp3",
  "url": "http://localhost:3000/audio/1-chuvasdegraca.mp3",
  "size": 2048576,
  "sizeFormatted": "2.00 MB",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "modifiedAt": "2024-01-15T10:30:00.000Z"
}
```

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor:
```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
API-Harpa-crista/
├── audio/           # Arquivos de áudio (.mp3)
├── hinos.json       # Dados dos hinos
├── server.js        # Servidor Express
├── package.json     # Dependências
└── README.md        # Documentação
```

## 🔧 Tecnologias

- Node.js
- Express.js
- File System (fs)

## 📊 Estatísticas

- 400 hinos disponíveis
- Arquivos de áudio em formato MP3
- API RESTful com CORS habilitado
- Suporte a streaming de áudio
