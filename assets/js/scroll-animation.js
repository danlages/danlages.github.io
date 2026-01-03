// Scroll animation for hero header
(function() {
  'use strict';
  
  const heroHeader = document.getElementById('heroHeader');
  const stickyNav = document.getElementById('stickyNav');
  
  if (!heroHeader) return;
  
  const heroHeight = heroHeader.offsetHeight;
  const scrollThreshold = 0; // Start fading immediately
  
  function handleScroll() {
    const scrollPosition = window.scrollY || window.pageYOffset;
    
    if (scrollPosition > scrollThreshold) {
      // Calculate opacity based on scroll position
      const fadeStart = scrollThreshold;
      const fadeEnd = heroHeight * 0.5; // Complete fade by 50% of hero height
      const fadeRange = fadeEnd - fadeStart;
      const fadeProgress = (scrollPosition - fadeStart) / fadeRange;
      
      // Apply fade out to hero
      if (fadeProgress >= 1) {
        heroHeader.classList.add('hidden');
        if (stickyNav) stickyNav.classList.add('visible');
      } else {
        heroHeader.classList.remove('hidden');
        heroHeader.style.opacity = 1 - (fadeProgress * 2); // Very aggressive fade
        heroHeader.style.transform = `translateY(-${fadeProgress * 60}px)`; // Very pronounced upward movement
        
        // Show sticky nav as hero fades
        if (stickyNav) {
          if (fadeProgress > 0.7) {
            stickyNav.classList.add('visible');
          } else {
            stickyNav.classList.remove('visible');
          }
        }
      }
    } else {
      // Reset to visible
      heroHeader.classList.remove('hidden');
      heroHeader.style.opacity = '1';
      heroHeader.style.transform = 'translateY(0)';
      if (stickyNav) stickyNav.classList.remove('visible');
    }
  }
  
  // Throttle scroll events for better performance
  let ticking = false;
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Initial check
  handleScroll();
})();

// Hamburger menu toggle
(function() {
  'use strict';
  
  const menuToggle = document.getElementById('menuToggle');
  const siteNav = document.getElementById('siteNav');
  
  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      siteNav.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.site-header')) {
        menuToggle.classList.remove('active');
        siteNav.classList.remove('active');
      }
    });
  }
})();
