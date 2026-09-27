/* ===========================================================
   ABDULLAH — Portfolio interactions
   - Sticky nav
   - Mobile drawer
   - Reveal on scroll (with explicit hero stagger via data-reveal-delay)
   - Work filters (smooth cross-fade)
   - Lazy YouTube video modal (scale + opacity)
   - Subtle portrait parallax
   - Scroll indicator fade
   =========================================================== */

(function () {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Nav scroll state ---------- */
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const scrollIndicator = document.getElementById('scrollIndicator');
    const portraitWrap = document.querySelector('.portrait-wrap');

    let lastScrollY = 0;
    const onScroll = () => {
        const y = window.scrollY;

        if (y > 24) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');

        // Hide scroll indicator once user starts scrolling
        if (scrollIndicator) {
            if (y > 120) scrollIndicator.classList.add('is-hidden');
            else scrollIndicator.classList.remove('is-hidden');
        }

        // Subtle portrait parallax (1-3% movement)
        if (!prefersReduced && portraitWrap) {
            const maxOffset = 18;
            const offset = Math.min(maxOffset, Math.max(-maxOffset, y * 0.03));
            portraitWrap.style.transform = `translateY(${offset * -0.4}px)`;
        }

        lastScrollY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- Mobile drawer ---------- */
    const closeMobile = () => {
        navToggle.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('is-open');
        if (isOpen) closeMobile();
        else {
            navToggle.classList.add('is-open');
            mobileMenu.classList.add('is-open');
            navToggle.setAttribute('aria-expanded', 'true');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    });

    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobile();
            closeModal();
        }
    });

    /* ---------- Cursor glow (subtle) ---------- */
    const glow = document.querySelector('.cursor-glow');
    if (glow && !prefersReduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let raf = null;
        window.addEventListener('mousemove', (e) => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                glow.style.setProperty('--mx', e.clientX + 'px');
                glow.style.setProperty('--my', e.clientY + 'px');
                glow.classList.add('active');
                raf = null;
            });
        }, { passive: true });
    }

    /* ---------- Reveal on scroll ----------
       Two paths:
       (a) elements with data-reveal-delay → fire on page load with explicit timing
       (b) generic .reveal elements → fire on intersection
    */
    const allReveals = document.querySelectorAll('.reveal, .reveal-portrait');

    // Hero stagger: items with data-reveal-delay fire automatically
    const heroReveals = document.querySelectorAll('[data-reveal-delay]');
    heroReveals.forEach(el => {
        const delay = parseInt(el.dataset.revealDelay || '0', 10);
        el.style.setProperty('--reveal-delay', delay + 'ms');
        // Add a tiny base delay so DOM is settled
        setTimeout(() => el.classList.add('is-visible'), 80 + delay);
    });

    // Portrait reveal — runs regardless (no data-reveal-delay attribute)
    const portraitReveal = document.querySelector('.reveal-portrait');
    if (portraitReveal && !heroReveals.length) {
        setTimeout(() => portraitReveal.classList.add('is-visible'), 200);
    }

    // IO for the rest
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    // Skip elements that already have a data-reveal-delay (they fire on load)
                    if (el.hasAttribute('data-reveal-delay')) {
                        io.unobserve(el);
                        return;
                    }
                    const baseDelay = parseInt(el.dataset.delay || '0', 10);
                    const stagger = i * 60; // light stagger for grouped content
                    el.style.setProperty('--reveal-delay', (baseDelay + stagger) + 'ms');
                    setTimeout(() => el.classList.add('is-visible'), baseDelay);
                    io.unobserve(el);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        // Only observe reveals that aren't hero (hero fires on load)
        document.querySelectorAll('.reveal').forEach(el => {
            if (!el.hasAttribute('data-reveal-delay')) io.observe(el);
        });
        // Portrait (no data-reveal-delay) — also observe for safety
        if (portraitReveal && !portraitReveal.hasAttribute('data-reveal-delay')) {
            io.observe(portraitReveal);
        }
    } else {
        document.querySelectorAll('.reveal:not(.is-visible), .reveal-portrait:not(.is-visible)')
            .forEach(el => el.classList.add('is-visible'));
    }

    /* ---------- Work filters (smooth) ---------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workGroups = document.querySelectorAll('.work-group');

    let filterAnimating = false;

    const applyFilter = (filter) => {
        if (filterAnimating) return;
        filterAnimating = true;

        // Hide all first
        workGroups.forEach(group => {
            const cat = group.dataset.group;
            const shouldShow = (filter === 'all' || cat === filter);
            if (!shouldShow) {
                group.classList.remove('is-visible');
            }
        });

        // After fade out, show matching groups
        setTimeout(() => {
            workGroups.forEach(group => {
                const cat = group.dataset.group;
                const shouldShow = (filter === 'all' || cat === filter);
                if (shouldShow) {
                    // Re-trigger animation by removing then adding after a frame
                    group.classList.remove('is-visible');
                    void group.offsetWidth;
                    group.classList.add('is-visible');
                }
            });
            filterAnimating = false;
        }, 220);
    };

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            applyFilter(btn.dataset.filter);
        });
    });

    applyFilter('all');

    /* ---------- Video modal (lazy load + scale + ESC) ---------- */
    const modal = document.getElementById('videoModal');
    const modalFrame = modal.querySelector('.modal-frame');
    const modalVideo = document.getElementById('modalVideo');

    let lastFocused = null;

    const closeModal = () => {
        if (!modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open');
        // Wait for fade-out, then hide + clear iframe
        setTimeout(() => {
            modal.setAttribute('hidden', '');
            modalVideo.innerHTML = '';
            document.body.style.overflow = '';
        }, 400);
        modalFrame.classList.remove('vertical');
        if (lastFocused) lastFocused.focus();
    };

    const openModal = (videoId, isVertical = false) => {
        lastFocused = document.activeElement;
        const params = new URLSearchParams({
            autoplay: '1',
            rel: '0',
            modestbranding: '1',
            playsinline: '1'
        });

        const src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;

        modalVideo.innerHTML = `<iframe src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="Video"></iframe>`;

        if (isVertical) modalFrame.classList.add('vertical');
        else modalFrame.classList.remove('vertical');

        modal.removeAttribute('hidden');
        void modal.offsetWidth;
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';

        setTimeout(() => modal.querySelector('.modal-close').focus(), 80);
    };

    modal.addEventListener('click', (e) => {
        if (e.target.dataset.close !== undefined) closeModal();
    });

    document.querySelectorAll('[data-video-id]').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const videoId = card.dataset.videoId;
            const isVertical = card.classList.contains('ugc-card') ||
                card.classList.contains('phone-card') ||
                card.dataset.vertical === 'true';
            openModal(videoId, isVertical);
        });
    });

    /* ---------- Active nav link on scroll ---------- */
    const sections = ['work', 'services', 'about', 'contact']
        .map(id => document.getElementById(id))
        .filter(Boolean);

    const navLinks = document.querySelectorAll('.nav-link');

    if ('IntersectionObserver' in window && sections.length) {
        const navIO = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(l => {
                        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' });

        sections.forEach(s => navIO.observe(s));
    }

    /* ---------- Smooth scroll for hash links (respect reduced motion) ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 60;
            window.scrollTo({
                top,
                behavior: prefersReduced ? 'auto' : 'smooth'
            });
        });
    });

/* ---------- YouTube thumbnail fallback ----------
       maxresdefault.jpg doesn't exist for every video — fall back to hqdefault.jpg
       (which always exists) so we never show a broken image.
    */
    document.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src') || '';
        const match = src.match(/i\.ytimg\.com\/vi\/([^\/]+)\/(maxresdefault|hqdefault|sddefault)\.jpg/);
        if (!match) return;
        const videoId = match[1];
        img.addEventListener('error', function handler() {
            if (img.dataset.fallbackApplied) return;
            img.dataset.fallbackApplied = '1';
            img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        }, { once: true });
    });

})();