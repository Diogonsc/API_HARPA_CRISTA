# API da Harpa Cristã 🎵

API REST completa para acessar os 640 hinos da Harpa Cristã, desenvolvida com Node.js e Express.

## 🚀 Como executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- NPM ou Yarn

### Instalação
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar em produção
npm start
```

A API estará disponível em `http://localhost:3000`

## 📚 Endpoints Disponíveis

### 1. Informações da API
```
GET /
```
Retorna informações sobre a API e endpoints disponíveis.

### 2. Listar todos os hinos
```
GET /hinos
```

**Parâmetros de query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Hinos por página (padrão: 20)
- `sort` (opcional): Ordenação (`number`, `title`, `author`)

**Exemplo:**
```bash
curl "http://localhost:3000/hinos?page=1&limit=10&sort=title"
```

### 3. Buscar hino por número
```
GET /hinos/:numero
```

**Exemplo:**
```bash
curl "http://localhost:3000/hinos/1"
```

### 4. Buscar hinos
```
GET /hinos/buscar?q=termo&tipo=todos
```

**Parâmetros:**
- `q` (obrigatório): Termo de busca
- `tipo` (opcional): Tipo de busca (`todos`, `titulo`, `autor`, `letra`)

**Exemplo:**
```bash
curl "http://localhost:3000/hinos/buscar?q=graça&tipo=letra"
```

### 5. Hino aleatório
```
GET /hinos/aleatorio
```

### 6. Estatísticas
```
GET /hinos/estatisticas
```

### 7. Buscar por autor
```
GET /hinos/autor/:autor
```

**Exemplo:**
```bash
curl "http://localhost:3000/hinos/autor/CPAD"
```

### 8. Buscar por faixa de números
```
GET /hinos/faixa/:inicio/:fim
```

**Exemplo:**
```bash
curl "http://localhost:3000/hinos/faixa/1/10"
```

## 📊 Estrutura dos Dados

Cada hino possui a seguinte estrutura:

```json
{
  "_id": "65d722b8fc66c875dc0edfe2",
  "title": "Chuvas De Graça",
  "verses": [
    {
      "sequence": 1,
      "lyrics": "Deus prometeu com certeza\nChuvas de graça mandar;",
      "chorus": false
    }
  ],
  "author": "CPAD / J.R.",
  "number": 1
}
```

## 🔍 Exemplos de Uso

### Buscar hinos que contenham "amor" na letra
```bash
curl "http://localhost:3000/hinos/buscar?q=amor&tipo=letra"
```

### Listar primeiros 5 hinos ordenados por título
```bash
curl "http://localhost:3000/hinos?limit=5&sort=title"
```

### Buscar hinos do autor "CPAD"
```bash
curl "http://localhost:3000/hinos/autor/CPAD"
```

### Obter estatísticas completas
```bash
curl "http://localhost:3000/hinos/estatisticas"
```

## 🌟 Funcionalidades

- ✅ **640 hinos** da Harpa Cristã
- ✅ **Busca por número** específico
- ✅ **Busca por título, autor ou letra**
- ✅ **Paginação** para listagem
- ✅ **Ordenação** por número, título ou autor
- ✅ **Hino aleatório**
- ✅ **Estatísticas** completas
- ✅ **Busca por autor** específico
- ✅ **Busca por faixa** de números
- ✅ **CORS habilitado** para uso em frontend
- ✅ **Tratamento de erros** robusto

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **JSON** - Armazenamento de dados

## 📝 Licença

Este projeto é de uso livre para fins educacionais e religiosos.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

**Desenvolvido com ❤️ para a comunidade cristã** # API_HARPA_CRISTA
