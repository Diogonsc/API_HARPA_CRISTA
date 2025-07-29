// Função auxiliar para formatar bytes
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Função para adicionar URL completa do áudio
const adicionarUrlAudio = (hino, req) => {
  if (hino.audio) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    hino.audioUrl = `${baseUrl}/${hino.audio}`;
  }
  return hino;
};

module.exports = {
  formatBytes,
  adicionarUrlAudio
}; 