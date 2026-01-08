/**
 * Women's Fashion Store - Advanced 3D Interactive Effects
 * Handles all dynamic 3D interactions, animations, and visual effects
 */

(function() {
  'use strict';

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFashionEffects);
  } else {
    initFashionEffects();
  }

  function initFashionEffects() {
    console.log('🌸 Initializing Women\'s Fashion 3D Effects...');
    
    // Core feature initialization
    init3DTiltCards();
    initParallaxHero();
    initScrollAnimations();
    initSparkleEffect();
    initProductHoverEffects();
    initButtonRippleEffects();
    initMouseFollowGlow();
    initConfettiOnHover();
    initColorShiftOnScroll();
  }

  /**
   * Advanced 3D Tilt Effect for Product Cards
   */
  function init3DTiltCards() {
    const cards = document.querySelectorAll(
      '.card, .product-card, .collection-card, .media-card, [class*="card"]'
    );
    
    cards.forEach(card => {
      // Set up 3D context
      card.style.transformStyle = 'preserve-3d';
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
      
      // Create shadow element
      const shadow = document.createElement('div');
      shadow.className = 'card-shadow-3d';
      shadow.style.cssText = `
        position: absolute;
        bottom: -30px;
        left: 5%;
        width: 90%;
        height: 30px;
        background: radial-gradient(ellipse, rgba(0,0,0,0.3), transparent);
        filter: blur(20px);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: -1;
      `;
      card.style.position = 'relative';
      card.appendChild(shadow);
      
      card.addEventListener('mouseenter', function() {
        shadow.style.opacity = '1';
      });
      
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * 12;
        const rotateY = ((centerX - x) / centerX) * 12;
        
        this.style.transform = `
          perspective(1200px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          scale3d(1.05, 1.05, 1.05) 
          translateZ(30px)
        `;
        this.style.boxShadow = `
          ${-rotateY * 2}px ${rotateX * 2}px 40px rgba(0, 0, 0, 0.3),
          0 0 20px rgba(102, 126, 234, 0.2)
        `;
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1) translateZ(0)';
        this.style.boxShadow = '';
        shadow.style.opacity = '0';
      });
    });
  }

  /**
   * Parallax Effect for Hero Section
   */
  function initParallaxHero() {
    const hero = document.querySelector('.hero-3d, .hero, [class*="hero"]');
    if (!hero) return;
    
    const layers = hero.querySelectorAll('*');
    
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      
      layers.forEach((layer, index) => {
        const speed = (index + 1) * 0.5;
        const translateX = x * speed;
        const translateY = y * speed;
        
        layer.style.transform = `translate(${translateX}px, ${translateY}px)`;
        layer.style.transition = 'transform 0.3s ease-out';
      });
    });
  }

  /**
   * Scroll-triggered animations
   */
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
          }, index * 100);
        }
      });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll(
      'section, .section, .product-card, .collection-card'
    );
    
    animateElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px) scale(0.95)';
      el.style.transition = `opacity 0.8s ease ${index * 0.05}s, transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.05}s`;
      observer.observe(el);
    });
  }

  /**
   * Sparkle effect on hover
   */
  function initSparkleEffect() {
    const sparkleElements = document.querySelectorAll(
      '.product-card, .collection-card, button, .btn, [class*="button"]'
    );
    
    sparkleElements.forEach(element => {
      element.addEventListener('mouseenter', createSparkles);
    });
    
    function createSparkles(e) {
      const rect = this.getBoundingClientRect();
      const sparkleCount = 8;
      
      for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-particle';
        sparkle.style.cssText = `
          position: absolute;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #fff, #f5576c);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1000;
          animation: sparkle-burst 1s ease-out forwards;
        `;
        
        const angle = (i / sparkleCount) * Math.PI * 2;
        const distance = 40 + Math.random() * 40;
        const x = rect.left + rect.width / 2 + Math.cos(angle) * distance;
        const y = rect.top + rect.height / 2 + Math.sin(angle) * distance;
        
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
      }
    }
    
    // Add sparkle animation to stylesheet
    if (!document.getElementById('sparkle-styles')) {
      const style = document.createElement('style');
      style.id = 'sparkle-styles';
      style.textContent = `
        @keyframes sparkle-burst {
          0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Enhanced product hover effects
   */
  function initProductHoverEffects() {
    const products = document.querySelectorAll('.product-card, [class*="product"]');
    
    products.forEach(product => {
      const images = product.querySelectorAll('img');
      
      product.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        images.forEach(img => {
          img.style.filter = 'brightness(1.1) saturate(1.3)';
          img.style.transition = 'filter 0.3s ease';
        });
      });
      
      product.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        
        images.forEach(img => {
          img.style.filter = 'brightness(1) saturate(1)';
        });
      });
    });
  }

  /**
   * Ripple effect on button clicks
   */
  function initButtonRippleEffects() {
    const buttons = document.querySelectorAll('button, .btn, [class*="button"], a[class*="btn"]');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: radial-gradient(circle, rgba(255,255,255,0.6), transparent);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
    
    // Add ripple animation
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Mouse follow glow effect
   */
  function initMouseFollowGlow() {
    const glow = document.createElement('div');
    glow.className = 'mouse-glow';
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(245, 87, 108, 0.15), transparent 70%);
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.2s ease-out;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(glow);
    
    document.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
    });
  }

  /**
   * Confetti effect on specific hover areas
   */
  function initConfettiOnHover() {
    const heroSection = document.querySelector('.hero, [class*="hero"]');
    if (!heroSection) return;
    
    let confettiInterval;
    
    heroSection.addEventListener('mouseenter', () => {
      confettiInterval = setInterval(createConfetti, 100);
    });
    
    heroSection.addEventListener('mouseleave', () => {
      clearInterval(confettiInterval);
    });
    
    function createConfetti() {
      const confetti = document.createElement('div');
      const colors = ['#f5576c', '#f093fb', '#667eea', '#fda085', '#23d5ab'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      confetti.style.cssText = `
        position: fixed;
        top: -20px;
        left: ${Math.random() * 100}%;
        width: 10px;
        height: 10px;
        background: ${randomColor};
        opacity: 0.8;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        transform: rotate(${Math.random() * 360}deg);
        animation: confetti-fall ${3 + Math.random() * 2}s linear;
        pointer-events: none;
        z-index: 1000;
      `;
      
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 5000);
    }
    
    if (!document.getElementById('confetti-styles')) {
      const style = document.createElement('style');
      style.id = 'confetti-styles';
      style.textContent = `
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Dynamic color shift on scroll
   */
  function initColorShiftOnScroll() {
    let scrollPosition = 0;
    
    window.addEventListener('scroll', () => {
      scrollPosition = window.scrollY;
      const hueRotation = (scrollPosition / 10) % 360;
      
      document.documentElement.style.setProperty('--scroll-hue', hueRotation);
    });
  }

  console.log('✨ Women\'s Fashion 3D Effects Loaded Successfully!');
})();
