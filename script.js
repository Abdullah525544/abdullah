/* ==========================================================================
   ABDULLAH — PREMIUM BLACK & NEON GREEN CREATIVE PORTFOLIO
   Interactive Logic, Mobile Drawer, Video Modal, Tabs & Animations
   ========================================================================== */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Data for Interactive Capabilities Section
  const capabilityData = {
    web: {
      number: '01 / SPECIFICATION',
      badge: 'ENGINEERED FOR PRODUCTION',
      title: 'WEB DESIGN & ARCHITECTURE',
      desc: 'Modern, high-performance web applications and brand websites built with precision engineering, responsive layouts, 60fps micro-interactions, and conversion-optimized structure.',
      imgSrc: 'https://i.ytimg.com/vi/MEr43Q2GdkM/maxresdefault.jpg',
      imgAlt: 'Precision Focused Healthcare Website Demonstration Preview',
      mediaTag: 'FEATURED // HEALTHCARE PLATFORM',
      mediaCaption: 'Precision Focused Healthcare — Patient Pathway Experience',
      deliverables: [
        'Custom Design Systems & Typography',
        'Next.js, Vite & Modern Vanilla Stacks',
        'Mobile-First Fluid Responsiveness',
        'SEO & Core Web Vitals Optimization',
        'CMS Integration & Headless Systems',
        'Interactive Prototyping & Motion'
      ],
      linkText: 'VIEW WEBSITE PROJECTS →',
      linkHref: '#work'
    },
    ugc: {
      number: '02 / SPECIFICATION',
      badge: 'HIGH RETENTION FEED ASSETS',
      title: 'UGC & SHORT-FORM PRODUCT CONTENT',
      desc: 'High-retention product video assets engineered for TikTok, Instagram Reels, and YouTube Shorts. Crisp visual lighting, dynamic pacing, and conversion-focused storytelling.',
      imgSrc: 'https://i.ytimg.com/vi/7E-zWxOlALw/hqdefault.jpg',
      imgAlt: 'Hair Oil UGC Video Demonstration Preview',
      mediaTag: '9:16 FEED ASSET // HOOK + RETENTION',
      mediaCaption: 'Hair Oil Texture Reel — 3s Hook & Retention Videography',
      deliverables: [
        'High-Retention 3-Second Hooks',
        'Macro Product & Detail Videography',
        'Natural UGC Scripting & Voiceover',
        'Platform-Optimized 9:16 Visuals',
        'Paid Social Ad Variations',
        'Fast Turnaround Production'
      ],
      linkText: 'EXPLORE UGC FEED →',
      linkHref: '#ugc'
    },
    ai: {
      number: '03 / SPECIFICATION',
      badge: 'SYSTEM AUTOMATION & TRIAGE',
      title: 'AI WORKFLOWS & VOICE AGENTS',
      desc: 'Autonomous AI phone receptionists, multi-step n8n automation pipelines, and connected CRM architectures designed to capture leads, resolve inquiries, and eliminate repetitive tasks.',
      imgSrc: 'https://i.ytimg.com/vi/r1W2g3Y0JAk/maxresdefault.jpg',
      imgAlt: 'AI Voice Agent Autonomous Workflow Demo Preview',
      mediaTag: 'REAL-TIME VOICE // 24/7 INTAKE',
      mediaCaption: 'Autonomous AI Voice Agent — Instant Calendly Booking & CRM Sync',
      deliverables: [
        '24/7 AI Voice Receptionists',
        'n8n & Make Workflow Orchestration',
        'Connected CRM & Lead Pipelines',
        'Automated Scheduling & Booking',
        'Database Sync & Webhook Routing',
        'Custom AI Agent Tool Calling'
      ],
      linkText: 'SEE AUTOMATION DEMOS →',
      linkHref: '#automation'
    },
    growth: {
      number: '04 / SPECIFICATION',
      badge: 'CONVERSION & CLIENT ACQUISITION',
      title: 'DIGITAL GROWTH & PERFORMANCE',
      desc: 'Holistic digital positioning combining organic content velocity, behavioral analytics, structured landing page testing, and frictionless client acquisition funnels.',
      imgSrc: 'assets/cert-digital-marketing.jpg',
      imgAlt: 'Digital Growth Strategy and Performance Certification',
      mediaTag: 'GROWTH FRAMEWORK // FULL-FUNNEL',
      mediaCaption: 'Organic Content Velocity + Structured Conversion Engine',
      deliverables: [
        'Conversion Rate Optimization (CRO)',
        'Full-Funnel Tracking Architecture',
        'Content Velocity & Distribution Strategy',
        'Offer Clarification & Value Messaging',
        'Technical Performance Audits',
        'Automated Follow-up Sequences'
      ],
      linkText: 'DISCUSS YOUR PROJECT →',
      linkHref: 'https://calendly.com/info-abdullah1027/30min'
    }
  };

  /* ---------- 1. MOBILE DRAWER & NAV ---------- */
  const navHamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav .btn');

  function openMobileNav() {
    if (!navHamburger || !mobileNav) return;
    navHamburger.classList.add('is-active');
    mobileNav.classList.add('is-open');
    navHamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!navHamburger || !mobileNav) return;
    navHamburger.classList.remove('is-active');
    mobileNav.classList.remove('is-open');
    navHamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navHamburger && mobileNav) {
    navHamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.contains('is-open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    mobileNavLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* ---------- 2. VIDEO MODAL SYSTEM ---------- */
  const videoModal = document.getElementById('videoModal');
  const modalContainer = document.getElementById('modalContainer');
  const modalVideoFrame = document.getElementById('modalVideoFrame');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');

  function openVideoModal(videoId, title, isPortrait) {
    if (!videoModal || !modalVideoFrame) return;

    if (modalTitle) {
      modalTitle.textContent = title || 'PROJECT PREVIEW';
    }

    if (isPortrait) {
      modalContainer.classList.add('is-portrait');
    } else {
      modalContainer.classList.remove('is-portrait');
    }

    // Embed YouTube with autoplay
    modalVideoFrame.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
        title="${title || 'Video Player'}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;

    videoModal.classList.add('is-active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal || !modalVideoFrame) return;
    videoModal.classList.remove('is-active');
    videoModal.setAttribute('aria-hidden', 'true');
    modalVideoFrame.innerHTML = '';
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', function (e) {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
  }

  // Attach Video Triggers
  document.querySelectorAll('[data-video-id]').forEach(function (trigger) {
    function handleTrigger(e) {
      e.preventDefault();
      const videoId = trigger.getAttribute('data-video-id');
      const title = trigger.getAttribute('data-video-title') || 'PROJECT VIDEO';
      const isPortrait = trigger.getAttribute('data-portrait') === 'true';
      if (videoId) {
        openVideoModal(videoId, title, isPortrait);
      }
    }

    trigger.addEventListener('click', handleTrigger);
    trigger.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Spacebar') {
        handleTrigger(e);
      }
    });
  });

  /* ---------- 2B. CERTIFICATE LIGHTBOX MODAL SYSTEM ---------- */
  const certModal = document.getElementById('certModal');
  const certModalBackdrop = document.getElementById('certModalBackdrop');
  const certModalCloseBtn = document.getElementById('certModalCloseBtn');
  const certModalImg = document.getElementById('certModalImg');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalIssuer = document.getElementById('certModalIssuer');
  const certModalId = document.getElementById('certModalId');
  const certModalDate = document.getElementById('certModalDate');
  const certModalSignatory = document.getElementById('certModalSignatory');
  const certModalDirectLink = document.getElementById('certModalDirectLink');
  let lastActiveElement = null;

  function openCertModal(data) {
    if (!certModal || !certModalImg) return;
    lastActiveElement = document.activeElement;

    certModalImg.src = data.imgSrc || '';
    certModalImg.alt = data.title ? `Official Certificate: ${data.title}` : 'Certificate image';
    if (certModalTitle) certModalTitle.textContent = data.title || 'Certificate Preview';
    if (certModalIssuer) certModalIssuer.textContent = data.issuer || 'OFFICIAL CREDENTIAL';
    if (certModalId) certModalId.textContent = data.id || '';
    if (certModalDate) certModalDate.textContent = data.date || '';
    if (certModalSignatory) certModalSignatory.textContent = data.signatory ? `Signatory: ${data.signatory}` : '';
    if (certModalDirectLink) {
      certModalDirectLink.href = data.imgSrc || '#';
    }

    certModal.classList.add('is-active');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button for keyboard accessibility
    if (certModalCloseBtn) {
      setTimeout(function () {
        certModalCloseBtn.focus();
      }, 50);
    }
  }

  function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove('is-active');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  if (certModalCloseBtn) {
    certModalCloseBtn.addEventListener('click', closeCertModal);
  }

  if (certModalBackdrop) {
    certModalBackdrop.addEventListener('click', closeCertModal);
  }

  if (certModal) {
    certModal.addEventListener('click', function (e) {
      if (e.target === certModal) {
        closeCertModal();
      }
    });
  }

  // Wire certificate card triggers
  document.querySelectorAll('.cert-preview-frame').forEach(function (frame) {
    function triggerOpen(e) {
      e.preventDefault();
      const data = {
        imgSrc: frame.getAttribute('data-cert-img'),
        title: frame.getAttribute('data-cert-title'),
        issuer: frame.getAttribute('data-cert-issuer'),
        id: frame.getAttribute('data-cert-id'),
        date: frame.getAttribute('data-cert-date'),
        signatory: frame.getAttribute('data-cert-signatory')
      };
      openCertModal(data);
    }

    frame.addEventListener('click', triggerOpen);
    frame.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        triggerOpen(e);
      }
    });
  });

  document.querySelectorAll('.btn-cert-view').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const targetCardId = btn.getAttribute('data-cert-target');
      const card = document.getElementById(targetCardId);
      if (card) {
        const frame = card.querySelector('.cert-preview-frame');
        if (frame) {
          const data = {
            imgSrc: frame.getAttribute('data-cert-img'),
            title: frame.getAttribute('data-cert-title'),
            issuer: frame.getAttribute('data-cert-issuer'),
            id: frame.getAttribute('data-cert-id'),
            date: frame.getAttribute('data-cert-date'),
            signatory: frame.getAttribute('data-cert-signatory')
          };
          openCertModal(data);
        }
      }
    });
  });

  /* ---------- 3. GLOBAL ESCAPE KEY HANDLER ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeMobileNav();
      closeVideoModal();
      closeCertModal();
    }
  });

  /* ---------- 4. CAPABILITIES INTERACTION ---------- */
  const capTabs = document.querySelectorAll('.capability-tab');
  const capNumber = document.getElementById('capNumber');
  const capBadge = document.getElementById('capBadge');
  const capTitle = document.getElementById('capTitle');
  const capDesc = document.getElementById('capDesc');
  const capPreviewImg = document.getElementById('capPreviewImg');
  const capMediaTag = document.getElementById('capMediaTag');
  const capMediaCaption = document.getElementById('capMediaCaption');
  const capDeliverables = document.getElementById('capDeliverables');
  const capLink = document.getElementById('capLink');
  const capPanelContent = document.getElementById('capPanelContent');

  function applyCapData(data) {
    if (capNumber) capNumber.textContent = data.number;
    if (capBadge) capBadge.textContent = data.badge;
    if (capTitle) capTitle.textContent = data.title;
    if (capDesc) capDesc.textContent = data.desc;

    if (capPreviewImg) {
      capPreviewImg.src = data.imgSrc;
      capPreviewImg.alt = data.imgAlt;
    }
    if (capMediaTag) capMediaTag.textContent = data.mediaTag;
    if (capMediaCaption) capMediaCaption.textContent = data.mediaCaption;

    if (capDeliverables) {
      capDeliverables.innerHTML = data.deliverables
        .map(function (item) {
          return `<li>${item}</li>`;
        })
        .join('');
    }

    if (capLink) {
      capLink.textContent = data.linkText;
      capLink.setAttribute('href', data.linkHref);
    }
  }

  function setCapability(key) {
    const data = capabilityData[key];
    if (!data) return;

    capTabs.forEach(function (tab) {
      const isSelected = tab.getAttribute('data-cap') === key;
      if (isSelected) {
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
      } else {
        tab.classList.remove('is-active');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
      }
    });

    if (capPanelContent && !prefersReduced) {
      capPanelContent.classList.add('is-transitioning');
      setTimeout(function () {
        applyCapData(data);
        capPanelContent.classList.remove('is-transitioning');
      }, 140);
    } else {
      applyCapData(data);
    }
  }

  capTabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      const key = tab.getAttribute('data-cap');
      setCapability(key);
    });

    // Keyboard navigation (Arrow keys, Home, End)
    tab.addEventListener('keydown', function (e) {
      let targetIndex = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        targetIndex = (index + 1) % capTabs.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        targetIndex = (index - 1 + capTabs.length) % capTabs.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetIndex = capTabs.length - 1;
      }
      if (targetIndex !== null) {
        capTabs[targetIndex].focus();
        const key = capTabs[targetIndex].getAttribute('data-cap');
        setCapability(key);
      }
    });
  });

  /* ---------- 5. SINGLE-ROW UGC MARQUEE CONTROLLER ---------- */
  function setupUgcMarquee() {
    const viewport = document.getElementById('ugcMarqueeViewport');
    const track = document.getElementById('ugcTrack');
    const prevBtn = document.getElementById('ugcPrevBtn');
    const nextBtn = document.getElementById('ugcNextBtn');
    const pauseBtn = document.getElementById('ugcPauseBtn');
    if (!viewport || !track) return;

    function updateMarqueeGeometry() {
      const totalWidth = track.scrollWidth;
      const viewWidth = viewport.clientWidth;
      // Travel distance so all 11 cards move smoothly into view
      const travel = Math.max(0, totalWidth - viewWidth + 48);
      track.style.setProperty('--ugc-max-travel', `-${travel}px`);

      // Speed ~32-35 pixels per second for the forward phase (86% of total cycle)
      const duration = Math.max(28, Math.round((travel / 34) / 0.86));
      track.style.setProperty('--ugc-duration', `${duration}s`);
    }

    updateMarqueeGeometry();

    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateMarqueeGeometry, 120);
    }, { passive: true });

    // Pause/Resume toggle button
    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        const isPaused = track.classList.toggle('is-paused');
        pauseBtn.textContent = isPaused ? '▶' : '❚❚';
        pauseBtn.setAttribute('aria-label', isPaused ? 'Resume auto scroll' : 'Pause auto scroll');
      });
    }

    // Manual navigation buttons (smooth manual nudge)
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        track.classList.add('is-paused');
        if (pauseBtn) pauseBtn.textContent = '▶';
        viewport.scrollBy({ left: -260, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        track.classList.add('is-paused');
        if (pauseBtn) pauseBtn.textContent = '▶';
        viewport.scrollBy({ left: 260, behavior: 'smooth' });
      });
    }
  }

  setupUgcMarquee();

  /* ---------- 6. ENTRANCE REVEAL & TIMELINE ANIMATIONS ---------- */
  if (!prefersReduced && 'IntersectionObserver' in window) {
    // Reveal on scroll
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });

    // Process Timeline Line Animation (Trigger Once)
    const timelineTrack = document.querySelector('.timeline-track-line');
    if (timelineTrack) {
      const timelineObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              timelineTrack.classList.add('is-active');
              timelineObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );
      timelineObserver.observe(timelineTrack);
    }

    // AI Workflow Animation (Trigger Once)
    const workflowTrack = document.querySelector('.workflow-nodes-track');
    if (workflowTrack) {
      const workflowObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const nodes = workflowTrack.querySelectorAll('.workflow-node');
              nodes.forEach(function (node, index) {
                setTimeout(function () {
                  node.classList.add('is-active-step');
                }, index * 220);
              });
              workflowObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );
      workflowObserver.observe(workflowTrack);
    }
  } else {
    // If reduced motion is active or IntersectionObserver unsupported
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
    const timelineTrack = document.querySelector('.timeline-track-line');
    if (timelineTrack) timelineTrack.classList.add('is-active');
    const nodes = document.querySelectorAll('.workflow-node');
    nodes.forEach(function (node) {
      node.classList.add('is-active-step');
    });
  }

  /* ---------- 7. ACTIVE NAVIGATION HIGHLIGHTING ---------- */
  const navSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', function () {
    let current = '';
    const scrollPos = window.scrollY + 120;

    navSections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    desktopNavLinks.forEach(function (link) {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('is-active');
      }
    });
  }, { passive: true });

})();