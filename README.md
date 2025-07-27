# 🎵 API da Harpa Cristã

Uma API REST completa para acessar e consultar os hinos da Harpa Cristã, desenvolvida em Node.js com Express.

## 📋 Sobre o Projeto

Esta API fornece acesso programático a todos os hinos da Harpa Cristã, permitindo busca por número, título, autor, letra e outras funcionalidades. Ideal para aplicações web, mobile ou qualquer sistema que precise integrar os hinos da Harpa Cristã.

## ✨ Funcionalidades

- 📚 **Acesso completo aos hinos**: Todos os hinos da Harpa Cristã disponíveis via API
- 🔍 **Busca avançada**: Busca por título, autor ou letra dos hinos
- 📊 **Estatísticas**: Informações detalhadas sobre a coleção de hinos
- 🎲 **Hino aleatório**: Retorna um hino aleatório para momentos de inspiração
- 📄 **Paginação**: Suporte a paginação para listagens grandes
- 🔄 **CORS habilitado**: Pronto para uso em aplicações web
- 📱 **API RESTful**: Endpoints bem estruturados e documentados

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd API-Harpa-crista
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor**
```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📖 Documentação da API

### Endpoint Principal

**GET** `/`

Retorna informações gerais da API e lista de endpoints disponíveis.

```json
{
  "message": "API da Harpa Cristã",
  "version": "1.0.0",
  "totalHinos": 640,
  "endpoints": {
    "/hinos": "Lista todos os hinos",
    "/hinos/:numero": "Busca hino por número",
    "/hinos/buscar": "Busca hinos por título ou autor",
    "/hinos/aleatorio": "Retorna um hino aleatório",
    "/hinos/estatisticas": "Estatísticas dos hinos"
  }
}
```

### Listar Todos os Hinos

**GET** `/hinos`

**Parâmetros de Query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 20)
- `sort` (opcional): Ordenação (`number`, `title`, `author`)

**Exemplo:**
```bash
GET /hinos?page=1&limit=10&sort=title
```

**Resposta:**
```json
{
  "hinos": [
    {
      "_id": { "$oid": "65d722b8fc66c875dc0edfe2" },
      "title": "Chuvas De Graça",
      "author": "CPAD / J.R.",
      "number": 1,
      "verses": [
        {
          "sequence": 1,
          "lyrics": "Deus prometeu com certeza...",
          "chorus": false
        }
      ]
    }
  ],
  "paginacao": {
    "pagina": 1,
    "porPagina": 10,
    "total": 640,
    "totalPaginas": 64
  }
}
```

### Buscar Hino por Número

**GET** `/hinos/:numero`

**Exemplo:**
```bash
GET /hinos/1
```

**Resposta:**
```json
{
  "_id": { "$oid": "65d722b8fc66c875dc0edfe2" },
  "title": "Chuvas De Graça",
  "author": "CPAD / J.R.",
  "number": 1,
  "verses": [...]
}
```

### Buscar Hinos

**GET** `/hinos/buscar`

**Parâmetros de Query:**
- `q` (obrigatório): Termo de busca
- `tipo` (opcional): Tipo de busca (`titulo`, `autor`, `letra`, `todos`)

**Exemplos:**
```bash
# Buscar por título
GET /hinos/buscar?q=graça&tipo=titulo

# Buscar por autor
GET /hinos/buscar?q=CPAD&tipo=autor

# Buscar na letra
GET /hinos/buscar?q=amor&tipo=letra

# Buscar em todos os campos
GET /hinos/buscar?q=Jesus&tipo=todos
```

**Resposta:**
```json
{
  "termo": "graça",
  "tipo": "titulo",
  "total": 5,
  "hinos": [...]
}
```

### Hino Aleatório

**GET** `/hinos/aleatorio`

Retorna um hino aleatório da coleção.

**Resposta:**
```json
{
  "_id": { "$oid": "..." },
  "title": "Nome do Hino",
  "author": "Autor",
  "number": 123,
  "verses": [...]
}
```

### Estatísticas dos Hinos

**GET** `/hinos/estatisticas`

Retorna estatísticas detalhadas sobre a coleção de hinos.

**Resposta:**
```json
{
  "totalHinos": 640,
  "totalAutores": 45,
  "autores": ["CPAD / J.R.", "CPAD / A.N.", ...],
  "mediaVersosPorHino": 4.2,
  "totalVersos": 2688,
  "totalRefroes": 320,
  "hinoComMaisVersos": {
    "numero": 123,
    "titulo": "Nome do Hino",
    "totalVersos": 8
  },
  "hinoComMenosVersos": {
    "numero": 456,
    "titulo": "Nome do Hino",
    "totalVersos": 2
  }
}
```

### Buscar Hinos por Autor

**GET** `/hinos/autor/:autor`

**Exemplo:**
```bash
GET /hinos/autor/CPAD
```

**Resposta:**
```json
{
  "autor": "CPAD",
  "total": 25,
  "hinos": [...]
}
```

### Buscar Hinos por Faixa de Números

**GET** `/hinos/faixa/:inicio/:fim`

**Exemplo:**
```bash
GET /hinos/faixa/1/10
```

**Resposta:**
```json
{
  "faixa": "1 - 10",
  "total": 10,
  "hinos": [...]
}
```

## 🧪 Testando a API

O projeto inclui um script de teste para verificar se a API está funcionando corretamente:

```bash
node test-api.js
```

Este script testa todos os principais endpoints e exibe os resultados no console.

## 📁 Estrutura do Projeto

```
API-Harpa-crista/
├── server.js          # Servidor Express principal
├── anthems.json       # Dados dos hinos (JSON)
├── test-api.js        # Script de teste da API
├── package.json       # Dependências e scripts
└── README.md          # Este arquivo
```

## 🔧 Tecnologias Utilizadas

- **Node.js**: Runtime JavaScript
- **Express**: Framework web para APIs
- **JSON**: Formato de dados dos hinos
- **CORS**: Middleware para Cross-Origin Resource Sharing

## 📊 Estrutura dos Dados

Cada hino possui a seguinte estrutura:

```json
{
  "_id": { "$oid": "..." },
  "title": "Título do Hino",
  "author": "Autor do Hino",
  "number": 1,
  "verses": [
    {
      "sequence": 1,
      "lyrics": "Letra do verso...",
      "chorus": false
    }
  ]
}
```

## 🚀 Deploy

### Variáveis de Ambiente

- `PORT`: Porta do servidor (padrão: 3000)

### Exemplo de Deploy

```bash
# Definir porta (opcional)
export PORT=8080

# Iniciar servidor
npm start
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `package.json` para mais detalhes.

## 📞 Suporte

Para dúvidas, sugestões ou problemas:

- Abra uma issue no repositório
- Entre em contato através dos canais oficiais

---

**Desenvolvido com ❤️ para a comunidade cristã**
