// ==========================================================================
// RAJE MAHARAJE - R&J INTERACTIVE CONTROLLER
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const siteHeader = document.getElementById('siteHeader');
  const heroVideo = document.getElementById('heroVideo');
  const drawerOpenBtn = document.getElementById('drawerOpenBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const sideDrawer = document.getElementById('sideDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  
  const searchOpenBtn = document.getElementById('searchOpenBtn');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');

  const cartOpenBtn = document.getElementById('cartOpenBtn');
  const cartCountEl = document.querySelector('.cart-count');

  const countrySelectorBtn = document.getElementById('countrySelectorBtn');
  const urlPreviewBar = document.getElementById('urlPreviewBar') || document.getElementById('browserUrlTooltip');

  // 1. Sticky Header scroll styling
  // Transparent on all standard sections, dark & visible ONLY in:
  // - "WELCOME TO OUR GIFTING WORLD" (#giftingWorld)
  // - Footer area (#footerNewsletter through #siteFooter)
  const giftingWorld = document.getElementById('giftingWorld');
  const footerNewsletter = document.getElementById('footerNewsletter');
  const siteFooter = document.getElementById('siteFooter');

  function updateHeaderState() {
    if (!siteHeader) return;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const isScrolled = scrollY > 30;

    if (isScrolled) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    const headerHeight = siteHeader.offsetHeight || 62;
    let isOverDarkTarget = false;

    // Check Section 1: "WELCOME TO OUR GIFTING WORLD"
    if (giftingWorld) {
      const rect = giftingWorld.getBoundingClientRect();
      if (rect.top < headerHeight && rect.bottom > 0) {
        isOverDarkTarget = true;
      }
    }

    // Check Section 2: Footer area (from newsletter through siteFooter, or when scrolled to footer bottom)
    const footerStart = footerNewsletter || siteFooter;
    if (!isOverDarkTarget && footerStart) {
      const topRect = footerStart.getBoundingClientRect();
      const bottomRect = siteFooter ? siteFooter.getBoundingClientRect() : topRect;
      const isAtBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 60);
      if ((topRect.top < headerHeight && bottomRect.bottom > 0) || (isAtBottom && bottomRect.top < window.innerHeight)) {
        isOverDarkTarget = true;
      }
    }

    if (isScrolled && isOverDarkTarget) {
      siteHeader.classList.add('dark-nav');
    } else {
      siteHeader.classList.remove('dark-nav');
    }
  }

  window.addEventListener('scroll', updateHeaderState, { passive: true });
  window.addEventListener('resize', updateHeaderState, { passive: true });
  window.addEventListener('hashchange', () => setTimeout(updateHeaderState, 100));
  window.addEventListener('load', updateHeaderState);
  updateHeaderState();

  // 2. Video Autoplay Robustness
  const autoplayVideos = document.querySelectorAll('video[autoplay]');
  autoplayVideos.forEach(videoEl => {
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Autoplay deferred by browser:', error);
      });
    }
  });

  // 3. Hamburger Side Drawer Handling
  function openDrawer() {
    if (sideDrawer && drawerBackdrop) {
      sideDrawer.classList.add('open');
      drawerBackdrop.classList.add('open');
      sideDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (sideDrawer && drawerBackdrop) {
      sideDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('open');
      sideDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (drawerOpenBtn) drawerOpenBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 4. Search Modal Handling
  function openSearch() {
    searchModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (searchInput) searchInput.focus();
    }, 150);
  }

  function closeSearch() {
    searchModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (searchOpenBtn) searchOpenBtn.addEventListener('click', openSearch);
  if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
  
  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeSearch();
    }
  });

  // 5. Cart Button Action
  let cartCount = 0;
  if (cartOpenBtn) {
    cartOpenBtn.addEventListener('click', () => {
      cartCount++;
      if (cartCountEl) {
        cartCountEl.textContent = cartCount;
        cartCountEl.style.transform = 'scale(1.3)';
        setTimeout(() => {
          cartCountEl.style.transform = 'scale(1)';
        }, 200);
      }
    });
  }

  // 6. Product Card Quick-Add interaction
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      cartCount++;
      if (cartCountEl) {
        cartCountEl.textContent = cartCount;
        cartCountEl.style.transform = 'scale(1.3)';
        setTimeout(() => {
          cartCountEl.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });

  // 7. Country Selector Switcher
  if (countrySelectorBtn) {
    countrySelectorBtn.addEventListener('click', () => {
      const current = countrySelectorBtn.querySelector('span');
      if (current) {
        current.textContent = current.textContent === 'India' ? 'Global ($)' : 'India';
      }
    });
  }

  // 8. Authentic Browser URL Tooltip Simulation
  // Shows the browser URL preview at the bottom left on link hover
  const hoverLinks = document.querySelectorAll('[data-url]');
  hoverLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const url = link.getAttribute('data-url');
      if (url && urlPreviewBar) {
        urlPreviewBar.textContent = url;
        urlPreviewBar.classList.add('active');
      }
    });
    link.addEventListener('mouseleave', () => {
      if (urlPreviewBar) {
        urlPreviewBar.classList.remove('active');
      }
    });
  });

  // 9. Press & Testimonials Slider Controller
  const pressSlides = document.querySelectorAll('.press-slide');
  const pressPrevBtn = document.getElementById('pressPrevBtn');
  const pressNextBtn = document.getElementById('pressNextBtn');
  let currentPressSlide = 0;
  let pressAutoTimer = null;

  function showPressSlide(index) {
    if (!pressSlides.length) return;
    currentPressSlide = (index + pressSlides.length) % pressSlides.length;
    pressSlides.forEach((slide, idx) => {
      if (idx === currentPressSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
  }

  if (pressPrevBtn) {
    pressPrevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPressSlide(currentPressSlide - 1);
      resetPressTimer();
    });
  }

  if (pressNextBtn) {
    pressNextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPressSlide(currentPressSlide + 1);
      resetPressTimer();
    });
  }

  function startPressTimer() {
    if (pressSlides.length > 1) {
      pressAutoTimer = setInterval(() => {
        showPressSlide(currentPressSlide + 1);
      }, 4000);
    }
  }

  function resetPressTimer() {
    if (pressAutoTimer) clearInterval(pressAutoTimer);
    startPressTimer();
  }

  const pressSection = document.getElementById('pressSlider');
  if (pressSection) {
    pressSection.addEventListener('mouseenter', () => {
      if (pressAutoTimer) clearInterval(pressAutoTimer);
    });
    pressSection.addEventListener('mouseleave', () => {
      startPressTimer();
    });
    startPressTimer();
  }
});
