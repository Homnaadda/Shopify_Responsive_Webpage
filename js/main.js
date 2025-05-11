document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initProductGallery();
  initProductVariants();
  initProductTabs();
  initQuantitySelector();
  initModals();
  initPairWellWithCarousel();
  initImageZoom();
  initColorComparison();
  initQuickView();
  initMiniCart();
  initReviewsTab();
  loadSavedVariants();
});

// Product Gallery
function initProductGallery() {
  const mainImage = document.getElementById('main-image');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const prevBtn = document.querySelector('.thumbnail-nav.prev');
  const nextBtn = document.querySelector('.thumbnail-nav.next');
  const thumbnailsContainer = document.querySelector('.thumbnails-container');
  
  // Set active thumbnail and update main image
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
      // Update active thumbnail
      thumbnails.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Update main image
      const imageUrl = this.getAttribute('data-image');
      mainImage.src = imageUrl;
      
      // Update selected color if thumbnail has color data
      const color = this.getAttribute('data-color');
      if (color) {
        updateSelectedColor(color);
      }
    });
  });
  
  // Thumbnail navigation
  if (prevBtn && nextBtn && thumbnailsContainer) {
    prevBtn.addEventListener('click', function() {
      thumbnailsContainer.scrollBy({ left: -200, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', function() {
      thumbnailsContainer.scrollBy({ left: 200, behavior: 'smooth' });
    });
  }
}

// Product Variants
function initProductVariants() {
  const colorSwatches = document.querySelectorAll('.color-swatch');
  const sizeBtns = document.querySelectorAll('.size-btn');
  const selectedColorEl = document.getElementById('selected-color');
  const selectedSizeEl = document.getElementById('selected-size');
  
  // Color swatches
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', function() {
      // Update active swatch
      colorSwatches.forEach(s => s.classList.remove('active'));
      this.classList.add('active');
      
      // Update selected color text
      const color = this.getAttribute('data-color');
      updateSelectedColor(color);
      
      // Find and click corresponding thumbnail
      const matchingThumbnail = document.querySelector(`.thumbnail[data-color="${color}"]`);
      if (matchingThumbnail) {
        matchingThumbnail.click();
      }
      
      // Save to localStorage
      localStorage.setItem('selectedColor', color);
    });
  });
  
  // Size buttons
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active button
      sizeBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Update selected size text
      const size = this.getAttribute('data-size');
      if (selectedSizeEl) {
        selectedSizeEl.textContent = size;
      }
      
      // Save to localStorage
      localStorage.setItem('selectedSize', size);
    });
  });
}

// Update selected color
function updateSelectedColor(color) {
  const selectedColorEl = document.getElementById('selected-color');
  if (selectedColorEl) {
    selectedColorEl.textContent = color;
  }
  
  // Update color swatches
  const colorSwatches = document.querySelectorAll('.color-swatch');
  colorSwatches.forEach(swatch => {
    if (swatch.getAttribute('data-color') === color) {
      swatch.classList.add('active');
    } else {
      swatch.classList.remove('active');
    }
  });
}

// Product Tabs
function initProductTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Update active tab button
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Update active tab panel
      tabPanels.forEach(panel => {
        if (panel.id === tabId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

// Quantity Selector
function initQuantitySelector() {
  const decreaseBtn = document.querySelector('.quantity-btn.decrease');
  const increaseBtn = document.querySelector('.quantity-btn.increase');
  const quantityInput = document.querySelector('.quantity-input');
  
  if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener('click', function() {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
    
    increaseBtn.addEventListener('click', function() {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue < 99) {
        quantityInput.value = currentValue + 1;
      }
    });
    
    quantityInput.addEventListener('change', function() {
      let value = parseInt(this.value);
      if (isNaN(value) || value < 1) {
        this.value = 1;
      } else if (value > 99) {
        this.value = 99;
      }
    });
  }
}

// Modals
function initModals() {
  const sizeChartBtn = document.querySelector('.size-chart-btn');
  const compareColorsBtn = document.querySelector('.compare-colors-btn');
  const writeReviewBtn = document.querySelector('.write-review-btn');
  const modalCloseButtons = document.querySelectorAll('.modal-close');
  const modalOverlay = document.querySelector('.modal-overlay');
  const sizeChartModal = document.getElementById('size-chart-modal');
  const compareColorsModal = document.getElementById('compare-colors-modal');
  const writeReviewModal = document.getElementById('write-review-modal');
  
  // Open Size Chart Modal
  if (sizeChartBtn && sizeChartModal) {
    sizeChartBtn.addEventListener('click', function() {
      openModal(sizeChartModal);
    });
  }
  
  // Open Compare Colors Modal
  if (compareColorsBtn && compareColorsModal) {
    compareColorsBtn.addEventListener('click', function() {
      openModal(compareColorsModal);
    });
  }
  
  // Open Write Review Modal
  if (writeReviewBtn && writeReviewModal) {
    writeReviewBtn.addEventListener('click', function() {
      openModal(writeReviewModal);
    });
  }
  
  // Close Modals
  modalCloseButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      closeModal(modal);
    });
  });
  
  // Close on overlay click
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function() {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) {
        closeModal(activeModal);
      }
    });
  }
  
  // Close on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) {
        closeModal(activeModal);
      }
      
      // Also close mini cart if open
      const miniCart = document.querySelector('.mini-cart');
      const miniCartOverlay = document.querySelector('.mini-cart-overlay');
      if (miniCart && miniCart.classList.contains('active')) {
        miniCart.classList.remove('active');
        miniCartOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
}

// Open Modal
function openModal(modal) {
  if (modal) {
    modal.classList.add('active');
    document.querySelector('.modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set focus on close button for accessibility
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      setTimeout(() => {
        closeBtn.focus();
      }, 100);
    }
  }
}

// Close Modal
function closeModal(modal) {
  if (modal) {
    modal.classList.remove('active');
    document.querySelector('.modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Pair Well With Carousel
function initPairWellWithCarousel() {
  const container = document.querySelector('.pair-products');
  const prevBtn = document.querySelector('.pair-well-container .scroll-btn.prev');
  const nextBtn = document.querySelector('.pair-well-container .scroll-btn.next');
  
  if (container && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function() {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', function() {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }
}

// Image Zoom
function initImageZoom() {
  const mainImage = document.getElementById('main-image');
  const zoomContainer = document.querySelector('.image-zoom-container');
  const zoomLens = document.querySelector('.image-zoom-lens');
  const zoomResult = document.getElementById('zoom-result');
  
  if (mainImage && zoomContainer && zoomLens && zoomResult) {
    let active = false;
    
    // Create zoom effect
    zoomContainer.addEventListener('mouseenter', function() {
      if (window.innerWidth > 1024) { // Only on desktop
        active = true;
        zoomLens.style.display = 'block';
        zoomResult.style.display = 'block';
        
        // Set background image for result
        zoomResult.style.backgroundImage = `url(${mainImage.src})`;
      }
    });
    
    zoomContainer.addEventListener('mouseleave', function() {
      active = false;
      zoomLens.style.display = 'none';
      zoomResult.style.display = 'none';
    });
    
    zoomContainer.addEventListener('mousemove', function(e) {
      if (!active) return;
      
      // Get cursor position
      const rect = zoomContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate lens position
      let lensX = x - (zoomLens.offsetWidth / 2);
      let lensY = y - (zoomLens.offsetHeight / 2);
      
      // Prevent lens from going outside the image
      if (lensX < 0) lensX = 0;
      if (lensY < 0) lensY = 0;
      if (lensX > zoomContainer.offsetWidth - zoomLens.offsetWidth) {
        lensX = zoomContainer.offsetWidth - zoomLens.offsetWidth;
      }
      if (lensY > zoomContainer.offsetHeight - zoomLens.offsetHeight) {
        lensY = zoomContainer.offsetHeight - zoomLens.offsetHeight;
      }
      
      // Position lens
      zoomLens.style.left = `${lensX}px`;
      zoomLens.style.top = `${lensY}px`;
      
      // Calculate background position for result
      const ratioX = (lensX / (zoomContainer.offsetWidth - zoomLens.offsetWidth)) * 100;
      const ratioY = (lensY / (zoomContainer.offsetHeight - zoomLens.offsetHeight)) * 100;
      
      zoomResult.style.backgroundPosition = `${ratioX}% ${ratioY}%`;
    });
  }
}

// Color Comparison
function initColorComparison() {
  const colorCheckboxes = document.querySelectorAll('.color-checkbox');
  const selectedCountEl = document.querySelector('.selected-count');
  const comparisonSwatches = document.querySelector('.comparison-swatches');
  const selectPrompt = document.querySelector('.select-prompt');
  
  if (colorCheckboxes.length > 0) {
    colorCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateColorComparison);
    });
  }
  
  function updateColorComparison() {
    const selectedColors = [];
    let selectedCount = 0;
    
    colorCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedCount++;
        selectedColors.push({
          color: checkbox.getAttribute('data-color'),
          element: checkbox.nextElementSibling.querySelector('.color-preview').style.backgroundColor
        });
        
        // Limit to 3 selections
        if (selectedCount > 3) {
          checkbox.checked = false;
          selectedCount = 3;
        }
      }
    });
    
    // Update selected count
    if (selectedCountEl) {
      selectedCountEl.textContent = `${selectedCount} selected`;
    }
    
    // Update comparison swatches
    if (comparisonSwatches) {
      comparisonSwatches.innerHTML = '';
      
      if (selectedColors.length > 0) {
        if (selectPrompt) {
          selectPrompt.style.display = 'none';
        }
        
        selectedColors.forEach(colorData => {
          const swatchEl = document.createElement('div');
          swatchEl.className = 'comparison-swatch';
          
          const colorEl = document.createElement('div');
          colorEl.className = 'swatch-color';
          colorEl.style.backgroundColor = colorData.element;
          
          const nameEl = document.createElement('span');
          nameEl.className = 'swatch-name';
          nameEl.textContent = colorData.color;
          
          swatchEl.appendChild(colorEl);
          swatchEl.appendChild(nameEl);
          comparisonSwatches.appendChild(swatchEl);
        });
      } else {
        if (selectPrompt) {
          selectPrompt.style.display = 'block';
        }
      }
    }
  }
}

// Quick View
function initQuickView() {
  const quickViewBtns = document.querySelectorAll('.quick-view-btn');
  const quickViewModal = document.getElementById('quick-view-modal');
  const quickViewTitle = document.getElementById('quick-view-title');
  const quickViewPrice = document.getElementById('quick-view-price');
  const quickViewImg = document.getElementById('quick-view-img');
  
  if (quickViewBtns.length > 0 && quickViewModal) {
    quickViewBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get product data
        const productName = this.getAttribute('data-product');
        const productImg = this.closest('.product-card__image, .pair-product__image').querySelector('img').src;
        const productPrice = this.closest('.product-card, .pair-product').querySelector('.product-card__price, .pair-product__price').textContent;
        
        // Update modal content
        if (quickViewTitle) quickViewTitle.textContent = productName;
        if (quickViewPrice) quickViewPrice.textContent = productPrice;
        if (quickViewImg) quickViewImg.src = productImg;
        
        // Open modal
        openModal(quickViewModal);
      });
    });
  }
}

// Mini Cart
function initMiniCart() {
  const cartIcon = document.querySelector('.cart-icon');
  const miniCart = document.querySelector('.mini-cart');
  const closeCart = document.querySelector('.close-cart');
  const miniCartOverlay = document.querySelector('.mini-cart-overlay');
  const continueShopping = document.querySelector('.continue-shopping');
  
  if (cartIcon && miniCart) {
    cartIcon.addEventListener('click', function() {
      miniCart.classList.add('active');
      miniCartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    if (closeCart) {
      closeCart.addEventListener('click', function() {
        miniCart.classList.remove('active');
        miniCartOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    if (miniCartOverlay) {
      miniCartOverlay.addEventListener('click', function() {
        miniCart.classList.remove('active');
        miniCartOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    
    if (continueShopping) {
      continueShopping.addEventListener('click', function() {
        miniCart.classList.remove('active');
        miniCartOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  }
}

// Reviews Tab
function initReviewsTab() {
  const reviewsCount = document.querySelector('.reviews-count');
  const reviewsTab = document.querySelector('.tab-btn[data-tab="reviews"]');
  
  if (reviewsCount && reviewsTab) {
    reviewsCount.addEventListener('click', function() {
      reviewsTab.click();
      
      // Scroll to tabs
      const tabsSection = document.querySelector('.product__tabs');
      if (tabsSection) {
        tabsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Initialize review form
  const reviewForm = document.querySelector('.review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your review! It will be published after moderation.');
      closeModal(document.getElementById('write-review-modal'));
    });
  }
  
  // Initialize helpful buttons
  const helpfulBtns = document.querySelectorAll('.helpful-btn');
  helpfulBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const currentCount = parseInt(this.textContent.match(/\d+/)[0]);
      this.textContent = this.textContent.replace(/\d+/, currentCount + 1);
      
      // Disable all buttons in this review
      const reviewItem = this.closest('.review-item');
      const buttons = reviewItem.querySelectorAll('.helpful-btn');
      buttons.forEach(b => {
        b.disabled = true;
        b.style.opacity = '0.5';
      });
      
      alert('Thank you for your feedback!');
    });
  });
}

// Load saved variants from localStorage
function loadSavedVariants() {
  const savedColor = localStorage.getItem('selectedColor');
  const savedSize = localStorage.getItem('selectedSize');
  
  if (savedColor) {
    const colorSwatch = document.querySelector(`.color-swatch[data-color="${savedColor}"]`);
    if (colorSwatch) {
      colorSwatch.click();
    }
  }
  
  if (savedSize) {
    const sizeBtn = document.querySelector(`.size-btn[data-size="${savedSize}"]`);
    if (sizeBtn) {
      sizeBtn.click();
    }
  }
}

// Add to Cart functionality
const addToCartBtn = document.querySelector('.add-to-cart-btn');
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', function() {
    const selectedColor = document.getElementById('selected-color').textContent;
    const selectedSize = document.getElementById('selected-size').textContent;
    const quantity = document.querySelector('.quantity-input').value;
    
    if (selectedSize === 'Select a size') {
      alert('Please select a size before adding to cart.');
      return;
    }
    
    // Simulate adding to cart
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      const currentCount = parseInt(cartCount.textContent);
      cartCount.textContent = currentCount + parseInt(quantity);
      
      // Show mini cart
      const miniCart = document.querySelector('.mini-cart');
      const miniCartOverlay = document.querySelector('.mini-cart-overlay');
      if (miniCart && miniCartOverlay) {
        miniCart.classList.add('active');
        miniCartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      
      // Show confirmation message
      const productTitle = document.querySelector('.product__title').textContent;
      alert(`Added to cart: ${quantity} × ${productTitle} - ${selectedColor}, Size ${selectedSize}`);
    }
  });
}

// Buy Now button
const buyNowBtn = document.querySelector('.buy-now-btn');
if (buyNowBtn) {
  buyNowBtn.addEventListener('click', function() {
    const selectedSize = document.getElementById('selected-size').textContent;
    
    if (selectedSize === 'Select a size') {
      alert('Please select a size before proceeding to checkout.');
      return;
    }
    
    alert('Proceeding to checkout...');
  });
}

// Bundle Add to Cart
const bundleAddBtn = document.querySelector('.bundle-add-btn');
if (bundleAddBtn) {
  bundleAddBtn.addEventListener('click', function() {
    // Simulate adding bundle to cart
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      const currentCount = parseInt(cartCount.textContent);
      cartCount.textContent = currentCount + 3; // 3 items in the bundle
      
      // Show mini cart
      const miniCart = document.querySelector('.mini-cart');
      const miniCartOverlay = document.querySelector('.mini-cart-overlay');
      if (miniCart && miniCartOverlay) {
        miniCart.classList.add('active');
        miniCartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      
      alert('Bundle added to cart!');
    }
  });
}

// Quick Add buttons in "Pair Well With" section
const quickAddBtns = document.querySelectorAll('.quick-add-btn');
quickAddBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const productName = this.closest('.pair-product__info').querySelector('h3').textContent;
    
    // Simulate adding to cart
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      const currentCount = parseInt(cartCount.textContent);
      cartCount.textContent = currentCount + 1;
      
      // Show mini cart
      const miniCart = document.querySelector('.mini-cart');
      const miniCartOverlay = document.querySelector('.mini-cart-overlay');
      if (miniCart && miniCartOverlay) {
        miniCart.classList.add('active');
        miniCartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      
      alert(`Added to cart: ${productName}`);
    }
  });
});

// Wishlist button
const wishlistBtn = document.querySelector('.wishlist-btn');
if (wishlistBtn) {
  wishlistBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    const isActive = this.classList.contains('active');
    
    // Change SVG fill when active
    const svg = this.querySelector('svg');
    if (svg) {
      if (isActive) {
        svg.setAttribute('fill', 'currentColor');
      } else {
        svg.setAttribute('fill', 'none');
      }
    }
    
    const productTitle = document.querySelector('.product__title').textContent;
    alert(`${isActive ? 'Added to' : 'Removed from'} wishlist: ${productTitle}`);
  });
}

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const headerNav = document.querySelector('.header__nav');

if (mobileMenuBtn && headerNav) {
  mobileMenuBtn.addEventListener('click', function() {
    headerNav.classList.toggle('active');
    this.classList.toggle('active');
    
    if (headerNav.classList.contains('active')) {
      headerNav.style.display = 'block';
    } else {
      headerNav.style.display = '';
    }
  });
}

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const emailInput = this.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
      alert(`Thank you for subscribing with ${emailInput.value}!`);
      emailInput.value = '';
    }
  });
}

// Recently viewed products carousel
const recentlyViewedProducts = document.querySelector('.recently-viewed-products');
if (recentlyViewedProducts) {
  // Simulate horizontal scroll with mouse wheel
  recentlyViewedProducts.addEventListener('wheel', function(e) {
    if (e.deltaY !== 0) {
      e.preventDefault();
      this.scrollLeft += e.deltaY;
    }
  });
}

// Responsive image handling
function handleResponsiveImages() {
  const productCards = document.querySelectorAll('.product-card, .pair-product');
  
  if (window.innerWidth < 768) {
    productCards.forEach(card => {
      const img = card.querySelector('img');
      if (img && img.src.includes('300x')) {
        img.src = img.src.replace('300x', '200x');
      }
    });
  } else {
    productCards.forEach(card => {
      const img = card.querySelector('img');
      if (img && img.src.includes('200x')) {
        img.src = img.src.replace('200x', '300x');
      }
    });
  }
}

// Call on load and resize
handleResponsiveImages();
window.addEventListener('resize', handleResponsiveImages);