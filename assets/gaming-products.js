/**
 * Gaming Products Interactive Features
 */

(function() {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('🎮 Gaming Products Module Loaded');
    
    initProductHover();
    initColorSwatches();
    initQuickView();
  }

  /**
   * Enhanced Product Hover Effects
   */
  function initProductHover() {
    const productCards = document.querySelectorAll('.gaming-product-card');
    
    productCards.forEach(card => {
      const media = card.querySelector('.gaming-product-card__media');
      if (!media) return;
      
      card.addEventListener('mouseenter', function() {
        // Add hover class for CSS animations
        this.classList.add('is-hovered');
      });
      
      card.addEventListener('mouseleave', function() {
        this.classList.remove('is-hovered');
      });
      
      // Track mouse position for glow effect
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const glow = this.querySelector('.gaming-product-card__glow');
        if (glow) {
          glow.style.setProperty('--mouse-x', `${x}%`);
          glow.style.setProperty('--mouse-y', `${y}%`);
        }
      });
    });
  }

  /**
   * Color Swatch Interactions
   */
  function initColorSwatches() {
    const swatches = document.querySelectorAll('.gaming-swatch:not(.gaming-swatch--more)');
    
    swatches.forEach(swatch => {
      swatch.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Remove active class from siblings
        const siblings = this.parentElement.querySelectorAll('.gaming-swatch');
        siblings.forEach(s => s.classList.remove('active'));
        
        // Add active class
        this.classList.add('active');
        
        // Visual feedback
        this.style.transform = 'scale(1.3)';
        setTimeout(() => {
          this.style.transform = '';
        }, 200);
      });
    });
    
    // Add active styles
    const style = document.createElement('style');
    style.textContent = `
      .gaming-swatch.active {
        border-color: var(--gaming-primary) !important;
        box-shadow: 0 0 15px var(--gaming-glow) !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Quick View Modal (placeholder for integration)
   */
  function initQuickView() {
    // This can be integrated with your existing quick view functionality
    const productLinks = document.querySelectorAll('.gaming-product-card__link');
    
    productLinks.forEach(link => {
      // Add data attribute for tracking
      link.dataset.productView = 'gaming';
    });
  }

})();
