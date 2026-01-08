// Mobile Navigation
const mobileNavTrigger = document.querySelector('.mobile-nav-trigger');
const mobileNavWrapper = document.querySelector('.mobile-nav-wrapper');
const mobileNavClose = document.querySelector('.mobile-nav-close');

if (mobileNavTrigger) {
  mobileNavTrigger.addEventListener('click', () => {
    mobileNavWrapper.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
}

if (mobileNavClose) {
  mobileNavClose.addEventListener('click', () => {
    mobileNavWrapper.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
}

// Collection Sorting
const sortSelect = document.querySelector('#SortBy');
if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', e.target.value);
    window.location.href = url.toString();
  });
}

// Cart Quantity Update
const quantityInputs = document.querySelectorAll('input[name="updates[]"]');
quantityInputs.forEach(input => {
  input.addEventListener('change', (e) => {
    const line = e.target.dataset.line;
    const quantity = e.target.value;
    
    fetch(window.routes.cart_change_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        line: line,
        quantity: quantity
      })
    })
    .then(response => response.json())
    .then(data => {
      location.reload();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
});

// Product Variant Selection
const variantSelect = document.querySelector('#ProductSelect');
if (variantSelect) {
  variantSelect.addEventListener('change', (e) => {
    const selectedVariant = e.target.value;
    // Update price, availability etc based on variant
    const form = e.target.closest('form');
    const submitButton = form.querySelector('[type="submit"]');
    
    const option = e.target.options[e.target.selectedIndex];
    if (option.disabled) {
      submitButton.setAttribute('disabled', 'disabled');
      submitButton.textContent = window.variantStrings.soldOut || 'Sold Out';
    } else {
      submitButton.removeAttribute('disabled');
      submitButton.textContent = window.variantStrings.addToCart || 'Add to Cart';
    }
  });
}

// Product Recommendations
const productRecommendationsSection = document.querySelector('.product-recommendations');
if (productRecommendationsSection) {
  const productId = productRecommendationsSection.dataset.productId;
  if (productId) {
    const url = `/recommendations/products?product_id=${productId}&limit=4&section_id=product-recommendations`;
    
    fetch(url)
      .then(response => response.text())
      .then(html => {
        if (html.trim().length) {
          productRecommendationsSection.innerHTML = html;
        }
      })
      .catch(error => {
        console.error('Error loading recommendations:', error);
      });
  }
}

// Smooth scroll to top
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (window.scrollY > 100) {
    header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// Add to cart with AJAX (enhancement)
const addToCartForms = document.querySelectorAll('form[action*="/cart/add"]');
addToCartForms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const submitButton = form.querySelector('[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Adding...';
    submitButton.setAttribute('disabled', 'disabled');
    
    fetch(window.routes.cart_add_url, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Update cart count
      const cartCount = document.querySelector('.cart-count-bubble span[aria-hidden="true"]');
      if (cartCount) {
        fetch('/cart.js')
          .then(res => res.json())
          .then(cart => {
            cartCount.textContent = cart.item_count;
          });
      }
      
      submitButton.textContent = 'Added!';
      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.removeAttribute('disabled');
      }, 2000);
    })
    .catch(error => {
      console.error('Error:', error);
      submitButton.textContent = 'Error - Try Again';
      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.removeAttribute('disabled');
      }, 2000);
    });
  });
});

// Newsletter form enhancement
const newsletterForms = document.querySelectorAll('form[action*="/contact"]');
newsletterForms.forEach(form => {
  form.addEventListener('submit', (e) => {
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('[type="submit"]');
    
    if (emailInput && emailInput.value) {
      submitButton.textContent = 'Subscribing...';
    }
  });
});
