(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Re-animate About counters each time About section enters view
   */
  const aboutSection = document.querySelector('#about');
  const aboutCounters = document.querySelectorAll('#about .about-metric-number[data-counter-end]');

  if (aboutSection && aboutCounters.length) {
    const animateAboutCounter = (counterEl) => {
      const endValue = Number(counterEl.getAttribute('data-counter-end'));
      const duration = 1200;
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        counterEl.textContent = String(Math.floor(endValue * progress));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          counterEl.textContent = String(endValue);
        }
      };

      counterEl.textContent = '0';
      window.requestAnimationFrame(step);
    };

    const runAboutCounters = () => {
      aboutCounters.forEach((counterEl) => {
        animateAboutCounter(counterEl);
      });
    };

    let aboutInView = false;
    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !aboutInView) {
          aboutInView = true;
          runAboutCounters();
        } else if (!entry.isIntersecting) {
          aboutInView = false;
        }
      });
    }, {
      threshold: 0.45
    });

    aboutObserver.observe(aboutSection);
  }

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /**
   * Re-trigger Experience timeline cascade animation each time section enters view
   */
  const experienceSection = document.querySelector('#experience');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (experienceSection && timelineItems.length) {
    const resetTimelineAnimations = () => {
      const timeline = experienceSection.querySelector('.experience-timeline');
      if (timeline) {
        timeline.classList.remove('animate-timeline');
        // Trigger reflow to restart card animation
        void timeline.offsetWidth;
        timeline.classList.add('animate-timeline');
      }
    };

    let experienceInView = false;
    const experienceObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !experienceInView) {
          experienceInView = true;
          resetTimelineAnimations();
        } else if (!entry.isIntersecting) {
          experienceInView = false;
        }
      });
    }, {
      threshold: 0.2
    });

    experienceObserver.observe(experienceSection);
  }

  /**
   * Experience cards: one "View details" trigger per card.
   * A hover popup lists all bullet points; closes when the mouse leaves.
   */
  document.querySelectorAll('#experience .timeline-item').forEach((item) => {
    const ul = item.querySelector('.timeline-content ul');
    if (!ul) return;

    const bullets = Array.from(ul.querySelectorAll('li')).map(li => li.textContent.trim()).filter(Boolean);
    if (!bullets.length) return;

    const jobTitle = (item.querySelector('.timeline-content h4') || {}).textContent || 'Experience Detail';

    // Build the hover popup anchored to this card
    const popup = document.createElement('div');
    popup.className = 'timeline-hover-popup';
    popup.setAttribute('role', 'tooltip');
    popup.innerHTML = `
      <div class="timeline-hover-popup-inner">
        <p class="timeline-hover-popup-title">${jobTitle}</p>
        <ul class="timeline-hover-popup-list">
          ${bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `;

    // Replace all <li> contents with a single trigger button
    ul.innerHTML = '';
    const li = document.createElement('li');
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'timeline-detail-trigger';
    trigger.innerHTML = '<i class="bi bi-chat-left-text"></i><span>View details</span>';
    li.appendChild(trigger);
    li.appendChild(popup);
    ul.appendChild(li);

    // Hover open / close with a small delay so moving between trigger→popup stays open
    let hideTimer;
    const showPopup = () => {
      clearTimeout(hideTimer);
      popup.classList.add('is-visible');
    };
    const hidePopup = () => {
      hideTimer = setTimeout(() => popup.classList.remove('is-visible'), 120);
    };

    trigger.addEventListener('mouseenter', showPopup);
    trigger.addEventListener('mouseleave', hidePopup);
    popup.addEventListener('mouseenter', showPopup);
    popup.addEventListener('mouseleave', hidePopup);
  });

})();