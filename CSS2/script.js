/**
 * Script do CineCatálogo
 * Funções para melhorar a experiência do usuário
 * e garantir acessibilidade
 */

// Configuração inicial quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  initializeImageHandling();
  initializeSmoothScroll();
  initializeFocusManagement();
});

/**
 * Inicializa o tratamento de imagens com lazy loading e fallback
 */
function initializeImageHandling() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  images.forEach(img => {
    // Adiciona classe de loading enquanto a imagem carrega
    if (!img.complete) {
      img.classList.add('img-loading');
    }
    
    // Remove classe de loading quando a imagem carregar
    img.addEventListener('load', function() {
      this.classList.remove('img-loading');
    });
    
    // Tratamento de erro para imagens quebradas
    img.addEventListener('error', function() {
      this.classList.remove('img-loading');
      this.classList.add('img-missing');
      this.alt = `Imagem não disponível: ${this.alt}`;
      
      // Cria um placeholder simples via CSS
      this.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${this.width || 400}" height="${this.height || 300}" viewBox="0 0 400 300">
          <rect width="100%" height="100%" fill="#222"/>
          <text x="50%" y="50%" fill="#ff6b6b" font-family="Arial" font-size="16" text-anchor="middle" dy=".3em">Imagem não encontrada</text>
          <text x="50%" y="60%" fill="#ffb3b3" font-family="Arial" font-size="12" text-anchor="middle">${this.alt}</text>
        </svg>`
      );
    });
  });
  
  // Verificação adicional para imagens que já podem estar quebradas
  checkForBrokenImages();
}

/**
 * Verifica se há imagens quebradas na página
 */
async function checkForBrokenImages() {
  const images = document.querySelectorAll('img');
  
  for (const img of images) {
    // Se a imagem já está marcada como quebrada, pula
    if (img.classList.contains('img-missing')) continue;
    
    // Verifica se a imagem está quebrada
    if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
      img.dispatchEvent(new Event('error'));
    } else if (!img.complete) {
      // Para imagens que ainda não carregaram, verifica após um tempo
      setTimeout(() => {
        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
          img.dispatchEvent(new Event('error'));
        }
      }, 1000);
    }
  }
}

/**
 * Inicializa a rolagem suave para âncoras
 */
function initializeSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Só aplica para links que são âncoras na mesma página
      if (href !== '#' && href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.menu').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Foca no elemento alvo para acessibilidade
          targetElement.setAttribute('tabindex', '-1');
          targetElement.focus();
        }
      }
    });
  });
}

/**
 * Inicializa o gerenciamento de foco para acessibilidade
 */
function initializeFocusManagement() {
  // Adiciona suporte para navegação por teclado nos cards
  const interactiveCards = document.querySelectorAll('.card-mini');
  
  interactiveCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keydown', function(e) {
      // Enter ou espaço ativam o clique
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Melhora o foco nos botões
  const buttons = document.querySelectorAll('.botao, .menu a');
  
  buttons.forEach(button => {
    button.addEventListener('focus', function() {
      this.style.outline = '2px solid #e50914';
      this.style.outlineOffset = '2px';
    });
    
    button.addEventListener('blur', function() {
      this.style.outline = '';
    });
  });
}

/**
 * Função utilitária para verificar se uma imagem existe
 * @param {string} url - URL da imagem a verificar
 * @returns {Promise<boolean>} - Promise que resolve para true se a imagem existe
 */
async function checkImageExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Exporta funções para uso global (se necessário)
window.CineCatalogo = {
  initializeImageHandling,
  checkForBrokenImages,
  checkImageExists
};