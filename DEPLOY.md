# 🚀 Deploy na Vercel

## Pré-requisitos

1. **Conta na Vercel**: Crie uma conta em [vercel.com](https://vercel.com)
2. **Vercel CLI** (opcional): `npm i -g vercel`

## Deploy Automático (Recomendado)

### 1. Conecte seu repositório
- Faça push do código para o GitHub/GitLab/Bitbucket
- Conecte o repositório na Vercel
- A Vercel detectará automaticamente que é um projeto Node.js

### 2. Configurações do Deploy
- **Framework Preset**: Node.js
- **Build Command**: `npm install` (automático)
- **Output Directory**: (deixar vazio)
- **Install Command**: `npm install` (automático)

### 3. Variáveis de Ambiente
- `PORT`: Deixar vazio (a Vercel define automaticamente)

## Deploy Manual com Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Para produção
vercel --prod
```

## 📁 Arquivos de Configuração

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  }
}
```

## ✅ Checklist de Deploy

- [ ] `package.json` com `main` apontando para `server.js`
- [ ] `vercel.json` configurado
- [ ] Arquivo `anthems.json` incluído no repositório
- [ ] Script `start` configurado no `package.json`
- [ ] CORS configurado no servidor
- [ ] Tratamento de erros implementado

## 🔍 Verificação Pós-Deploy

Após o deploy, teste os endpoints:

```bash
# Informações da API
curl https://seu-projeto.vercel.app/

# Listar hinos
curl https://seu-projeto.vercel.app/hinos

# Buscar hino específico
curl https://seu-projeto.vercel.app/hinos/1

# Estatísticas
curl https://seu-projeto.vercel.app/hinos/estatisticas
```

## 🐛 Troubleshooting

### Problema: "Cannot find module"
- Verifique se `package.json` tem `"main": "server.js"`
- Confirme que `server.js` existe na raiz

### Problema: "anthems.json not found"
- Verifique se o arquivo está no repositório
- Confirme o caminho no `server.js`

### Problema: Timeout
- Aumente `maxDuration` no `vercel.json`
- Otimize consultas grandes

## 📊 Monitoramento

- Use o dashboard da Vercel para monitorar logs
- Configure alertas para erros
- Monitore performance das funções

## 🔄 Atualizações

Para atualizar a API:

1. Faça as mudanças no código
2. Commit e push para o repositório
3. A Vercel fará deploy automático
4. Ou use `vercel --prod` para deploy manual 