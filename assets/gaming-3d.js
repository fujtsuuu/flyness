/**
 * Gaming Accessories 3D Interactive Effects
 * Mobile-optimized with performance considerations
 */

(function() {
  'use strict';

  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGamingEffects);
  } else {
    initGamingEffects();
  }

  function initGamingEffects() {
    console.log('🎮 Initializing Gaming 3D Effects...');
    
    // Core features
    init3DProductCards();
    initScrollAnimations();
    initStatsCounter();
    initFloatingProducts();
    initButtonEffects();
    
    if (!prefersReducedMotion) {
      initMouseFollowEffects();
      initParallaxEffects();
    }
  }

  /**
   * 3D Tilt Effect for Product Cards
   */
  function init3DProductCards() {
    const cards = document.querySelectorAll('.gaming-product-card');
    
    cards.forEach(card => {
      let bounds;
      
      // Mobile: use touch events
      if ('ontouchstart' in window) {
        card.addEventListener('touchmove', handleTouch);
      } else {
        // Desktop: use mouse events
        card.addEventListener('mouseenter', function() {
          bounds = card.getBoundingClientRect();
        });
        
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', resetCard);
      }
      
      function handleMouseMove(e) {
        if (!bounds) return;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.left;
        const topY = mouseY - bounds.top;
        const centerX = leftX - bounds.width / 2;
        const centerY = topY - bounds.height / 2;
        const maxTilt = 10;
        
        const rotateX = (centerY / (bounds.height / 2)) * -maxTilt;
        const rotateY = (centerX / (bounds.width / 2)) * maxTilt;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Update glow position
        const glow = card.querySelector('.gaming-product-card__glow');
        if (glow) {
          const percentX = (leftX / bounds.width) * 100;
          const percentY = (topY / bounds.height) * 100;
          glow.style.setProperty('--mouse-x', `${percentX}%`);
          glow.style.setProperty('--mouse-y', `${percentY}%`);
        }
      }
      
      function handleTouch(e) {
        const touch = e.touches[0];
        const mockEvent = {
          clientX: touch.clientX,
          clientY: touch.clientY
        };
        handleMouseMove(mockEvent);
      }
      
      function resetCard() {
        card.style.transform = '';
      }
    });
  }

  /**
   * Scroll-triggered Animations
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.gaming-feature-card, .gaming-product-card, .gaming-stat'
    );
    
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements
      animatedElements.forEach(el => el.style.opacity = '1');
      return;
    }
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
    
    // Apply visible class styles
    const style = document.createElement('style');
    style.textContent = `
      .is-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Stats Counter Animation
   */
  function initStatsCounter() {
    const stats = document.querySelectorAll('.gaming-stat__number');
    
    stats.forEach(stat => {
      const target = parseInt(stat.dataset.count) || 0;
      let current = 0;
      const increment = target / 60; // 60 frames for smooth animation
      const duration = 2000; // 2 seconds
      const frameTime = duration / 60;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(stat);
      
      function animateCount() {
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            stat.textContent = formatNumber(target);
            clearInterval(timer);
          } else {
            stat.textContent = formatNumber(Math.floor(current));
          }
        }, frameTime);
      }
    });
    
    function formatNumber(num) {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toString();
    }
  }

  /**
   * Floating Products 3D Animation
   */
  function initFloatingProducts() {
    const floatingProducts = document.querySelectorAll('.floating-product');
    
    floatingProducts.forEach((product, index) => {
      const speed = product.dataset.speed || 3;
      const delay = index * 0.5;
      
      // Create unique animation
      const animation = product.animate([
        {
          transform: 'translateY(0px) translateZ(0px) rotateY(0deg) rotateX(0deg)',
          offset: 0
        },
        {
          transform: `translateY(-20px) translateZ(30px) rotateY(${5 + index * 2}deg) rotateX(5deg)`,
          offset: 0.25
        },
        {
          transform: `translateY(-40px) translateZ(60px) rotateY(-${5 + index * 2}deg) rotateX(-5deg)`,
          offset: 0.5
        },
        {
          transform: `translateY(-20px) translateZ(30px) rotateY(${5 + index * 2}deg) rotateX(5deg)`,
          offset: 0.75
        },
        {
          transform: 'translateY(0px) translateZ(0px) rotateY(0deg) rotateX(0deg)',
          offset: 1
        }
      ], {
        duration: 6000 / speed,
        delay: delay * 1000,
        iterations: Infinity,
        easing: 'ease-in-out'
      });
      
      // Pause animations on low battery (mobile optimization)
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
          if (battery.level < 0.2) {
            animation.playbackRate = 0.5; // Slow down animation
          }
        });
      }
    });
  }

  /**
   * Button Ripple and Particle Effects
   */
  function initButtonEffects() {
    const buttons = document.querySelectorAll('.gaming-button, .gaming-quick-add');
    
    buttons.forEach(button => {
      button.addEventListener('click', createRipple);
      button.addEventListener('mousemove', updateParticlePosition);
    });
    
    function createRipple(e) {
      const button = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 0;
      `;
      
      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    }
    
    function updateParticlePosition(e) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      button.style.setProperty('--mouse-x', `${x}%`);
      button.style.setProperty('--mouse-y', `${y}%`);
    }
    
    // Add ripple animation to stylesheet
    if (!document.getElementById('gaming-ripple-style')) {
      const style = document.createElement('style');
      style.id = 'gaming-ripple-style';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Mouse Follow Glow Effect
   */
  function initMouseFollowEffects() {
    // Only on desktop
    if (window.innerWidth < 768) return;
    
    const hero = document.querySelector('.gaming-hero');
    if (!hero) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });
    
    function updateGlow() {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;
      
      currentX += dx * 0.1;
      currentY += dy * 0.1;
      
      hero.style.setProperty('--mouse-x', `${currentX}px`);
      hero.style.setProperty('--mouse-y', `${currentY}px`);
      
      requestAnimationFrame(updateGlow);
    }
    
    updateGlow();
  }

  /**
   * Parallax Scroll Effect
   */
  function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.floating-product, .gaming-particles');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }
  }

  /**
   * Quick Add to Cart Functionality
   */
  const quickAddButtons = document.querySelectorAll('.gaming-quick-add');
  quickAddButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const productId = this.dataset.productId;
      addToCart(productId, this);
    });
  });
  
  function addToCart(productId, button) {
    // Show loading state
    const originalText = button.innerHTML;
    button.innerHTML = '<span>Adding...</span>';
    button.disabled = true;
    
    // Simulate add to cart (integrate with your Shopify theme's cart system)
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: productId,
        quantity: 1
      })
    })
    .then(response => response.json())
    .then(data => {
      // Success animation
      button.innerHTML = '<span>✓ Added!</span>';
      button.style.background = 'var(--gaming-accent)';
      
      // Trigger cart update event
      document.dispatchEvent(new CustomEvent('cart:updated'));
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        button.style.background = '';
      }, 2000);
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      button.innerHTML = '<span>Error</span>';
      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
      }, 2000);
    });
  }

  /**
   * Performance Monitoring
   */
  function monitorPerformance() {
    // Reduce animation complexity on lower-end devices
    if ('connection' in navigator) {
      const connection = navigator.connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        document.documentElement.classList.add('reduced-animations');
        
        // Add reduced animation styles
        const style = document.createElement('style');
        style.textContent = `
          .reduced-animations * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }
  
  monitorPerformance();

  /**
   * Lazy Load Enhancement
   */
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // Add loaded class for fade-in effect
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  console.log('✨ Gaming 3D Effects Initialized Successfully!');
})();
