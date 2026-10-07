/* ===========================================================
   ABDULLAH â€” Portfolio interactions
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
       (a) elements with data-reveal-delay â†’ fire on page load with explicit timing
       (b) generic .reveal elements â†’ fire on intersection
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

    // Portrait reveal â€” runs regardless (no data-reveal-delay attribute)
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
        // Portrait (no data-reveal-delay) â€” also observe for safety
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
       maxresdefault.jpg doesn't exist for every video â€” fall back to hqdefault.jpg
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

    /* ---------- Certificate modal ---------- */
    const certModal = document.getElementById('certModal');
    const certModalImage = document.getElementById('modalCertImage');

    const openCertModal = (imageUrl) => {
        certModalImage.innerHTML = `<img src="${imageUrl}" alt="Certificate" />`;
        certModal.removeAttribute('hidden');
        void certModal.offsetWidth;
        certModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => certModal.querySelector('.modal-close').focus(), 80);
    };

    const closeCertModal = () => {
        if (!certModal.classList.contains('is-open')) return;
        certModal.classList.remove('is-open');
        setTimeout(() => {
            certModal.setAttribute('hidden', '');
            certModalImage.innerHTML = '';
            document.body.style.overflow = '';
        }, 400);
    };

    certModal.addEventListener('click', (e) => {
        if (e.target.dataset.close !== undefined) closeCertModal();
    });

    document.querySelectorAll('.cert-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal when clicking the verify link
            if (e.target.closest('.cert-verify')) return;
            const imageUrl = card.dataset.certImage;
            if (imageUrl) openCertModal(imageUrl);
        });
    });

    // ESC closes whichever modal is open
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCertModal();
        }
    });

    /* ---------- Scroll progress diagram (home page only) ---------- */
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const spFill = document.getElementById('spFill');
        const spMarkers = scrollProgress.querySelectorAll('.sp-marker');
        const trackedSections = Array.from(spMarkers).map(m => {
            const id = m.dataset.section;
            const el = document.getElementById(id);
            return el ? { id, el, marker: m } : null;
        }).filter(Boolean);

        // Click a marker â†’ smooth scroll to its section
        spMarkers.forEach(marker => {
            marker.addEventListener('click', () => {
                const id = marker.dataset.section;
                const target = document.getElementById(id);
                if (target) {
                    const top = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
                }
            });
        });

        // Update on scroll
        let spTicking = false;
        const updateProgress = () => {
            spTicking = false;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
            if (spFill) spFill.style.height = Math.min(100, Math.max(0, pct)) + '%';

            // Determine which section is currently in view
            const viewportMid = window.scrollY + window.innerHeight * 0.4;
            let activeId = null;
            trackedSections.forEach(({ id, el }) => {
                const top = el.offsetTop;
                const bottom = top + el.offsetHeight;
                if (viewportMid >= top && viewportMid < bottom) activeId = id;
            });

            spMarkers.forEach(m => {
                m.classList.toggle('is-active', m.dataset.section === activeId);
            });

            // Show indicator once user scrolls past hero
            if (window.scrollY > 200) scrollProgress.classList.add('is-visible');
            else scrollProgress.classList.remove('is-visible');
        };

        window.addEventListener('scroll', () => {
            if (!spTicking) {
                requestAnimationFrame(updateProgress);
                spTicking = true;
            }
        }, { passive: true });
        updateProgress();
    }

})();

/* ===========================================================
   ABDULLAH — Interactive Upgrade
   GSAP + ScrollTrigger behavior
   (Hero parallax · Manifesto reveal · Capabilities pin ·
    Horizontal showcase · UGC reel parallax · SVG diagrams ·
    Services sticky rows · Toolkit cloud · Cursor label)
   =========================================================== */

(function () {
    'use strict';

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        // CDN failed or reduced motion — bail silently; existing vanilla behavior still works
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- CURSOR MICRO-LABEL ---------- */
    const cursorLabel = document.getElementById('cursorLabel');
    const cursorLabelText = cursorLabel ? cursorLabel.querySelector('.cursor-label-text') : null;
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (cursorLabel && isFinePointer && !prefersReduced) {
        let cx = 0, cy = 0, tx = 0, ty = 0;
        let rafId = null;
        const tick = () => {
            cx += (tx - cx) * 0.18;
            cy += (ty - cy) * 0.18;
            cursorLabel.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) scale(${cursorLabel.classList.contains('is-visible') ? 1 : 0.6})`;
            rafId = requestAnimationFrame(tick);
        };
        window.addEventListener('mousemove', (e) => {
            tx = e.clientX;
            ty = e.clientY;
            if (!rafId) rafId = requestAnimationFrame(tick);
        }, { passive: true });

        document.querySelectorAll('[data-cursor-label]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                const t = el.dataset.cursorLabel;
                if (cursorLabelText) cursorLabelText.textContent = t;
                cursorLabel.classList.add('is-visible');
            });
            el.addEventListener('mouseleave', () => {
                cursorLabel.classList.remove('is-visible');
            });
        });
    }

    /* ---------- HERO SCROLL TYPOGRAPHY (BUILD ? BUILD DIGITAL ? BUILD DIGITAL EXPERIENCES) ---------- */
    const stTexts = document.querySelectorAll('.hero-scrolltype .st-text');
    if (stTexts.length && !prefersReduced) {
        ScrollTrigger.create({
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
                const p = self.progress;
                stTexts.forEach((el, i) => {
                    const t = i / (stTexts.length - 1);
                    if (p >= t) el.classList.add('is-on');
                    else el.classList.remove('is-on');
                });
            }
        });
    }

    /* ---------- HERO SUBTLE PARALLAX (text/portrait/annotations at different speeds) ---------- */
    if (!prefersReduced) {
        gsap.to('.hero-text', {
            y: -40,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });
        gsap.to('[data-parallax="0.4"]', {
            y: -20,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });
        gsap.to('.hero-annotation', {
            y: -10,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });
    }

    /* ---------- MANIFESTO LINE REVEAL ---------- */
    const manifestoLines = document.querySelectorAll('.manifesto-title .m-line');
    if (manifestoLines.length) {
        if (prefersReduced) {
            manifestoLines.forEach(l => l.classList.add('is-on'));
        } else {
            ScrollTrigger.batch(manifestoLines, {
                start: 'top 80%',
                onEnter: (els) => els.forEach(l => l.classList.add('is-on')),
                once: true
            });
        }
    }

    /* ---------- CAPABILITIES STICKY PIN (left stays, right swaps by scroll) ---------- */
    const capSection = document.querySelector('.section-capabilities');
    if (capSection && !prefersReduced) {
        const rows = capSection.querySelectorAll('.cap-row');
        const panels = capSection.querySelectorAll('.cap-panel');
        const total = rows.length;

        const setActive = (idx) => {
            rows.forEach((r, i) => r.classList.toggle('is-active', i === idx));
            panels.forEach((p, i) => p.classList.toggle('is-active', i === idx));
        };

        // Click rows to scroll-jump to that panel
        rows.forEach((row, i) => {
            row.addEventListener('click', () => {
                const panel = panels[i];
                if (!panel) return;
                const rect = panel.getBoundingClientRect();
                const top = rect.top + window.scrollY - 140;
                window.scrollTo({ top, behavior: 'smooth' });
            });
        });

        ScrollTrigger.create({
            trigger: capSection,
            start: 'top top+=100',
            end: () => `+=${(total - 1) * 320}`,
            pin: '.cap-left',
            pinSpacing: false,
            anticipatePin: 1
        });

        // Trigger panel swap based on which panel is in view
        panels.forEach((panel, i) => {
            ScrollTrigger.create({
                trigger: panel,
                start: 'top 60%',
                end: 'bottom 40%',
                onEnter: () => setActive(i),
                onEnterBack: () => setActive(i)
            });
        });
    } else if (capSection) {
        // Reduced motion: just default first active
        capSection.querySelectorAll('.cap-row').forEach((r, i) => r.classList.toggle('is-active', i === 0));
        capSection.querySelectorAll('.cap-panel').forEach((p, i) => p.classList.toggle('is-active', i === 0));
    }

    /* ---------- HORIZONTAL SCROLL SHOWCASE ---------- */
    const showcasePin = document.querySelector('.showcase-pin');
    const showcaseTrack = document.getElementById('showcaseTrack');
    if (showcasePin && showcaseTrack && !prefersReduced) {
        const cards = showcaseTrack.querySelectorAll('.showcase-card');
        const cardWidth = () => cards[0] ? cards[0].offsetWidth + 36 : 720;

        // Scale neighbors
        cards.forEach((card, i) => {
            ScrollTrigger.create({
                trigger: card,
                containerAnimation: undefined,
                start: 'top 80%',
                onToggle: (self) => {
                    card.style.transform = self.isActive ? 'scale(1)' : 'scale(0.92)';
                    card.style.opacity = self.isActive ? '1' : '0.7';
                }
            });
        });

        const distance = () => showcaseTrack.scrollWidth - window.innerWidth;

        gsap.to(showcaseTrack, {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
                trigger: showcasePin,
                start: 'top top',
                end: () => `+=${distance()}`,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1
            }
        });

        // Pin the section
        ScrollTrigger.create({
            trigger: showcasePin,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            anticipatePin: 1
        });
    }

    /* ---------- UGC REEL WALL PARALLAX (different speeds per item) ---------- */
    if (!prefersReduced) {
        document.querySelectorAll('.ugc-reel-item[data-parallax-speed]').forEach(item => {
            const speed = parseFloat(item.dataset.parallaxSpeed) || 0.1;
            gsap.to(item, {
                y: () => -window.innerHeight * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.section-ugc-reel',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

    /* ---------- HOW I THINK (SVG line draw + node activation) ---------- */
    const thinkSvg = document.getElementById('thinkSvg');
    if (thinkSvg && !prefersReduced) {
        const lineFill = thinkSvg.querySelector('.td-line-fill');
        const pulse = thinkSvg.querySelector('.td-pulse');
        const nodes = thinkSvg.querySelectorAll('.td-node');

        // Set initial dashoffset
        const lineLen = lineFill.getTotalLength();
        lineFill.style.strokeDasharray = lineLen;
        lineFill.style.strokeDashoffset = lineLen;

        ScrollTrigger.create({
            trigger: '.think-diagram',
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1,
            onUpdate: (self) => {
                const p = self.progress;
                lineFill.style.strokeDashoffset = lineLen * (1 - p);
                pulse.setAttribute('cy', 60 + p * 640);
                pulse.style.opacity = p > 0.02 && p < 0.98 ? 1 : 0;

                const activeIdx = Math.min(nodes.length - 1, Math.floor(p * nodes.length));
                nodes.forEach((n, i) => n.classList.toggle('is-active', i <= activeIdx));
            }
        });
    } else if (thinkSvg) {
        // Reduced motion: just show everything
        const lineFill = thinkSvg.querySelector('.td-line-fill');
        const lineLen = lineFill.getTotalLength();
        lineFill.style.strokeDashoffset = 0;
        thinkSvg.querySelectorAll('.td-node').forEach(n => n.classList.add('is-active'));
    }

    /* ---------- AI FLOW DIAGRAM ---------- */
    const aiFlowSvg = document.getElementById('aiFlowSvg');
    if (aiFlowSvg && !prefersReduced) {
        const pathFill = aiFlowSvg.querySelector('.af-path-fill');
        const signal = aiFlowSvg.querySelector('.af-signal');
        const nodes = aiFlowSvg.querySelectorAll('.af-node');

        const pathLen = pathFill.getTotalLength();
        pathFill.style.strokeDasharray = pathLen;
        pathFill.style.strokeDashoffset = pathLen;

        ScrollTrigger.create({
            trigger: '.ai-flow-stage',
            start: 'top 75%',
            end: 'bottom 70%',
            scrub: 1,
            onUpdate: (self) => {
                const p = self.progress;
                pathFill.style.strokeDashoffset = pathLen * (1 - p);

                const point = pathFill.getPointAtLength(pathLen * p);
                signal.setAttribute('cx', point.x);
                signal.setAttribute('cy', point.y);
                signal.style.opacity = p > 0.01 && p < 0.99 ? 1 : 0;

                // Activate node based on its order
                const activeIdx = Math.min(nodes.length - 1, Math.floor(p * nodes.length));
                nodes.forEach((n, i) => n.classList.toggle('is-active', i <= activeIdx));
            }
        });

        // Tooltip behavior on hover
        const tooltip = document.getElementById('afTooltip');
        const tooltipTitle = tooltip ? tooltip.querySelector('.af-tooltip-title') : null;
        const tooltipDesc = tooltip ? tooltip.querySelector('.af-tooltip-desc') : null;

        if (tooltip) {
            const tips = {
                user: ['User', 'The source — a website visitor, lead, or customer.'],
                input: ['Input', 'The first signal — a form, message, or trigger event.'],
                agent: ['AI Agent', 'Processes incoming data and decides the response.'],
                logic: ['Logic', 'Applies business rules and conditional logic.'],
                automation: ['Automation', 'Triggers actions based on the agent\'s decision.'],
                crm: ['CRM / DB', 'Stores and organizes customer information.'],
                action: ['Action', 'Final action — reply, follow-up, alert, or task.']
            };

            aiFlowSvg.parentElement.querySelectorAll('.af-node').forEach(node => {
                const step = node.dataset.step;
                const tip = tips[step];
                if (!tip || !tooltip) return;
                node.addEventListener('mouseenter', () => {
                    tooltipTitle.textContent = tip[0];
                    tooltipDesc.textContent = tip[1];
                    const r = node.getBoundingClientRect();
                    const pr = aiFlowSvg.parentElement.getBoundingClientRect();
                    tooltip.style.left = (r.left - pr.left + r.width / 2) + 'px';
                    tooltip.style.top = (r.top - pr.top - 4) + 'px';
                    tooltip.classList.add('is-visible');
                });
                node.addEventListener('mouseleave', () => {
                    tooltip.classList.remove('is-visible');
                });
            });
        }
    } else if (aiFlowSvg) {
        const pathFill = aiFlowSvg.querySelector('.af-path-fill');
        if (pathFill) pathFill.style.strokeDashoffset = 0;
        aiFlowSvg.parentElement.querySelectorAll('.af-node').forEach(n => n.classList.add('is-active'));
    }

    /* ---------- TOOLKIT CLOUD REVEAL ---------- */
    const tkWords = document.querySelectorAll('.tk-word');
    if (tkWords.length) {
        if (prefersReduced) {
            tkWords.forEach(w => w.classList.add('is-on'));
        } else {
            ScrollTrigger.batch(tkWords, {
                start: 'top 85%',
                onEnter: (els) => {
                    els.forEach((w, i) => {
                        setTimeout(() => w.classList.add('is-on'), i * 50);
                    });
                },
                once: true
            });
        }
    }

    /* ---------- CURSOR LABEL BINDINGS (auto-bind VIEW/PLAY based on video card type) ---------- */
    if (cursorLabel && isFinePointer) {
        document.querySelectorAll('[data-video-id]').forEach(el => {
            el.setAttribute('data-cursor-label', 'Play');
        });
        document.querySelectorAll('.text-link, .btn').forEach(el => {
            if (el.hasAttribute('data-cursor-label')) return;
            el.setAttribute('data-cursor-label', '');
            el.addEventListener('mouseenter', () => {
                if (!cursorLabelText) return;
                cursorLabelText.textContent = '?';
                cursorLabel.classList.add('is-visible');
            });
            el.addEventListener('mouseleave', () => {
                cursorLabel.classList.remove('is-visible');
            });
        });
    }

})();
