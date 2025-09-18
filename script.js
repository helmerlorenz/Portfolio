// Skills Animation
function animateSkills() {
  const skillBars = document.querySelectorAll('.skill-progress');
  skillBars.forEach(bar => {
    const progress = bar.getAttribute('data-progress');
    bar.style.width = progress + '%';
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Portfolio Carousel
class PortfolioCarousel {
  constructor() {
    this.track = document.getElementById('portfolioTrack');
    this.items = this.track.querySelectorAll('.portfolio-item');
    this.cornerNavLeft = document.getElementById('cornerNavLeft');
    this.cornerNavRight = document.getElementById('cornerNavRight');
    
    this.currentIndex = 0;
    this.itemsToShow = this.getItemsToShow();
    this.totalItems = this.items.length;
    
    this.init();
    this.setupEventListeners();
    this.handleResize();
  }
  
  getItemsToShow() {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 1;
    if (width <= 1024) return 2;
    return 3;
  }
  
  init() {
    // Clone items for infinite scrolling
    this.createInfiniteLoop();
    this.updateCarousel();
  }
  
  createInfiniteLoop() {
    // Clear any existing clones
    const existingClones = this.track.querySelectorAll('.portfolio-item-clone');
    existingClones.forEach(clone => clone.remove());
    
    // Clone items and append to the end
    this.items.forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add('portfolio-item-clone');
      this.track.appendChild(clone);
    });
    
    // Clone items and prepend to the beginning
    [...this.items].reverse().forEach(item => {
      const clone = item.cloneNode(true);
      clone.classList.add('portfolio-item-clone');
      this.track.insertBefore(clone, this.track.firstChild);
    });
    
    // Update current index to account for prepended clones
    this.currentIndex = this.totalItems;
  }
  
  updateCarousel() {
    const allItems = this.track.querySelectorAll('.portfolio-item, .portfolio-item-clone');
    const itemWidth = allItems[0].offsetWidth;
    const gap = 32; // 2rem gap
    const translateX = -(this.currentIndex * (itemWidth + gap));
    
    this.track.style.transform = `translateX(${translateX}px)`;
    
    // Corner navigation is always visible for infinite scroll
    this.cornerNavLeft.style.display = 'flex';
    this.cornerNavRight.style.display = 'flex';
  }
  
  next() {
    this.currentIndex++;
    this.updateCarousel();
    
    // Reset position if we've gone past the original items
    if (this.currentIndex >= this.totalItems * 2) {
      setTimeout(() => {
        this.track.style.transition = 'none';
        this.currentIndex = this.totalItems;
        this.updateCarousel();
        setTimeout(() => {
          this.track.style.transition = 'transform 0.5s ease-in-out';
        }, 50);
      }, 500);
    }
  }
  
  prev() {
    this.currentIndex--;
    this.updateCarousel();
    
    // Reset position if we've gone before the original items
    if (this.currentIndex < 0) {
      setTimeout(() => {
        this.track.style.transition = 'none';
        this.currentIndex = this.totalItems - 1;
        this.updateCarousel();
        setTimeout(() => {
          this.track.style.transition = 'transform 0.5s ease-in-out';
        }, 50);
      }, 500);
    }
  }
  
  setupEventListeners() {
    this.cornerNavLeft.addEventListener('click', () => this.prev());
    this.cornerNavRight.addEventListener('click', () => this.next());
    
    // Touch/swipe support
    let startX = 0;
    let isDragging = false;
    
    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });
    
    this.track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    }, { passive: false });
    
    this.track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }, { passive: true });
    
    // Mouse drag support
    this.track.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isDragging = true;
      this.track.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });
    
    document.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      this.track.style.cursor = 'grab';
      
      const endX = e.clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    });
  }
  
  handleResize() {
    window.addEventListener('resize', () => {
      const newItemsToShow = this.getItemsToShow();
      if (newItemsToShow !== this.itemsToShow) {
        this.itemsToShow = newItemsToShow;
        this.createInfiniteLoop();
        this.updateCarousel();
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Animate skills when skills section comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkills();
        observer.unobserve(entry.target);
      }
    });
  });

  const skillsSection = document.querySelector('.skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  }

  // Initialize portfolio carousel
  new PortfolioCarousel();
});