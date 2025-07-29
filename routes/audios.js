const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { formatBytes } = require('../utils/helpers');

// Rota para acessar arquivos de áudio diretamente
router.get('/:filename', (req, res) => {
  try {
    let filename = req.params.filename;
    
    const possibleFilenames = [
      filename,
      decodeURIComponent(filename),
      decodeURIComponent(filename.replace(/\+/g, ' ')),
      filename.replace(/%20/g, ' '),
      filename.replace(/%C3%A7/g, 'ç'),
      filename.replace(/%C3%A1/g, 'á'),
      filename.replace(/%C3%A0/g, 'à'),
      filename.replace(/%C3%A3/g, 'ã'),
      filename.replace(/%C3%B3/g, 'ó'),
      filename.replace(/%C3%B5/g, 'õ'),
      filename.replace(/%C3%A9/g, 'é'),
      filename.replace(/%C3%AA/g, 'ê'),
      filename.replace(/%C3%AD/g, 'í'),
      filename.replace(/%C3%B4/g, 'ô'),
      filename.replace(/%C3%BA/g, 'ú')
    ];
    
    let audioPath = null;
    let foundFilename = null;
    
    for (const testFilename of possibleFilenames) {
      const testPath = path.join(__dirname, '..', 'audio', testFilename);
      if (fs.existsSync(testPath)) {
        audioPath = testPath;
        foundFilename = testFilename;
        break;
      }
    }
    
    if (!audioPath) {
      console.log('Arquivo não encontrado. Tentativas:', possibleFilenames);
      return res.status(404).json({
        error: 'Arquivo de áudio não encontrado',
        filename: filename,
        attempted: possibleFilenames
      });
    }
    
    console.log('Arquivo encontrado:', audioPath);
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    const stream = fs.createReadStream(audioPath);
    stream.pipe(res);
    
    stream.on('error', (error) => {
      console.error('Erro ao servir arquivo de áudio:', error);
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Erro ao reproduzir áudio',
          message: 'Ocorreu um erro ao tentar reproduzir o arquivo de áudio'
        });
      }
    });
  } catch (error) {
    console.error('Erro na rota de áudio:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Ocorreu um erro inesperado'
    });
  }
});

// Listar todos os áudios disponíveis
router.get('/', (req, res) => {
  try {
    const audioDir = path.join(__dirname, '..', 'audio');
    const files = fs.readdirSync(audioDir);
    
    const audioFiles = files.filter(file => 
      file.toLowerCase().endsWith('.mp3') || 
      file.toLowerCase().endsWith('.wav') || 
      file.toLowerCase().endsWith('.ogg')
    );
    
    const audios = audioFiles.map(file => {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const filePath = path.join(audioDir, file);
      const stats = fs.statSync(filePath);
      
      const match = file.match(/^(\d+)-/);
      const numeroHino = match ? parseInt(match[1]) : null;
      
      return {
        filename: file,
        url: `${baseUrl}/audio/${encodeURIComponent(file)}`,
        size: stats.size,
        sizeFormatted: formatBytes(stats.size),
        numeroHino: numeroHino,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      };
    });
    
    audios.sort((a, b) => {
      if (a.numeroHino && b.numeroHino) {
        return a.numeroHino - b.numeroHino;
      }
      return a.filename.localeCompare(b.filename);
    });
    
    res.json({
      total: audios.length,
      audios: audios,
      estatisticas: {
        totalSize: audios.reduce((sum, audio) => sum + audio.size, 0),
        totalSizeFormatted: formatBytes(audios.reduce((sum, audio) => sum + audio.size, 0)),
        mediaSize: audios.length > 0 ? formatBytes(audios.reduce((sum, audio) => sum + audio.size, 0) / audios.length) : '0 B'
      }
    });
  } catch (error) {
    console.error('Erro ao listar áudios:', error);
    res.status(500).json({
      error: 'Erro ao listar arquivos de áudio',
      message: 'Ocorreu um erro ao tentar listar os arquivos de áudio'
    });
  }
});

// Buscar áudio por número do hino
router.get('/hino/:numero', (req, res) => {
  try {
    const numero = parseInt(req.params.numero);
    
    if (isNaN(numero)) {
      return res.status(400).json({ 
        error: 'Número do hino deve ser um valor numérico' 
      });
    }
    
    const audioDir = path.join(__dirname, '..', 'audio');
    const files = fs.readdirSync(audioDir);
    
    const audioFile = files.find(file => {
      const match = file.match(/^(\d+)-/);
      return match && parseInt(match[1]) === numero;
    });
    
    if (!audioFile) {
      return res.status(404).json({
        error: `Áudio para o hino número ${numero} não encontrado`,
        message: 'Verifique se o arquivo de áudio existe na pasta audio/'
      });
    }
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const filePath = path.join(audioDir, audioFile);
    const stats = fs.statSync(filePath);
    
    res.json({
      numeroHino: numero,
      filename: audioFile,
      url: `${baseUrl}/audio/${encodeURIComponent(audioFile)}`,
      size: stats.size,
      sizeFormatted: formatBytes(stats.size),
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime
    });
  } catch (error) {
    console.error('Erro ao buscar áudio por número:', error);
    res.status(500).json({
      error: 'Erro ao buscar áudio',
      message: 'Ocorreu um erro ao tentar buscar o arquivo de áudio'
    });
  }
});

// Áudio aleatório
router.get('/aleatorio', (req, res) => {
  try {
    const audioDir = path.join(__dirname, '..', 'audio');
    const files = fs.readdirSync(audioDir);
    
    const audioFiles = files.filter(file => 
      file.toLowerCase().endsWith('.mp3') || 
      file.toLowerCase().endsWith('.wav') || 
      file.toLowerCase().endsWith('.ogg')
    );
    
    if (audioFiles.length === 0) {
      return res.status(404).json({
        error: 'Nenhum arquivo de áudio encontrado'
      });
    }
    
    const randomFile = audioFiles[Math.floor(Math.random() * audioFiles.length)];
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const filePath = path.join(audioDir, randomFile);
    const stats = fs.statSync(filePath);
    
    const match = randomFile.match(/^(\d+)-/);
    const numeroHino = match ? parseInt(match[1]) : null;
    
    res.json({
      filename: randomFile,
      url: `${baseUrl}/audio/${encodeURIComponent(randomFile)}`,
      numeroHino: numeroHino,
      size: stats.size,
      sizeFormatted: formatBytes(stats.size),
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime
    });
  } catch (error) {
    console.error('Erro ao buscar áudio aleatório:', error);
    res.status(500).json({
      error: 'Erro ao buscar áudio aleatório',
      message: 'Ocorreu um erro ao tentar buscar um arquivo de áudio aleatório'
    });
  }
});

module.exports = router; 