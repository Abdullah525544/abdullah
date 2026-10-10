/* ===========================================================
   ABDULLAH — Vanilla interactions
   Sticky nav · Mobile drawer · Reveal on scroll ·
   Capability swap · Process step activation · UGC filter ·
   Video modal (lazy) · Thumbnail fallback · Smooth scroll
   =========================================================== */

(function () {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Nav scroll state ---------- */
    const nav = document.getElementById('nav');
    const onScroll = () => {
        if (!nav) return;
        // No-op for sticky nav (CSS handles it)
    };

    /* ---------- Mobile drawer ---------- */
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    const closeMobile = () => {
        if (!navToggle) return;
        navToggle.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (navToggle && mobileMenu) {
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
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { closeMobile(); closeModal(); closeCert(); }
    });

    /* ---------- Reveal (data-d delay) ---------- */
    document.querySelectorAll('[data-d]').forEach(el => {
        const d = parseInt(el.dataset.d || '0', 10);
        el.style.setProperty('--d', d + 'ms');
        setTimeout(() => el.classList.add('is-on'), 60 + d);
    });

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    if (el.hasAttribute('data-d')) { io.unobserve(el); return; }
                    const baseDelay = parseInt(el.dataset.delay || '0', 10);
                    const stagger = i * 60;
                    el.style.setProperty('--d', (baseDelay + stagger) + 'ms');
                    setTimeout(() => el.classList.add('is-on'), baseDelay);
                    io.unobserve(el);
                }
            });
        }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.tk-reveal').forEach(el => {
            if (!el.hasAttribute('data-d')) io.observe(el);
        });
    } else {
        document.querySelectorAll('.tk-reveal:not(.is-on)').forEach(el => el.classList.add('is-on'));
    }

    /* ---------- Capabilities: click-swap content ---------- */
    const capList = document.getElementById('capList');
    const capLabel = document.getElementById('capLabel');
    const capTag1 = document.getElementById('capTag1');
    const capTag2 = document.getElementById('capTag2');
    const capDeliverables = document.getElementById('capDeliverables');
    const capDiagram = document.getElementById('capDiagram');
    const capPanel = document.getElementById('capPanel');

    const capContent = {
        web: {
            label: 'Specification Archive // 01',
            tag1: 'Web Architecture', tag2: '60fps UX',
            deliverables: 'DELIVERABLES: Next.js / Tailwind / Webflow / Supabase',
            diagram: `<div class="viewport">
                        <div class="viewport-head"><span>VIEWPORT // 1440x900</span><span class="status">STATUS: STABLE 99.8%</span></div>
                        <div class="vp-grid-1">
                            <div class="a"><div class="h1"></div><div class="h2"></div></div>
                            <div class="b"><div class="b1"></div><div class="b2">CONVERSION READY</div></div>
                        </div>
                        <div class="vp-grid-2">
                            <div class="cell">FLUID LAYOUT</div>
                            <div class="cell">DESIGN TOKENS</div>
                            <div class="cell hl">HEADLESS CMS</div>
                        </div>
                    </div>
                    <p class="tk-cap-quote">"We strip unnecessary latency and decorative fluff. Every interaction is mapped out to guide buyer decisions with zero ambiguity."</p>`,
            quote: '"We strip unnecessary latency and decorative fluff. Every interaction is mapped out to guide buyer decisions with zero ambiguity."'
        },
        ugc: {
            label: 'Reel Production // 02',
            tag1: '9:16 Vertical', tag2: 'Native Hook',
            deliverables: 'STACK: CapCut Pro · Adobe Premiere · Figma Templates',
            diagram: `<div class="viewport">
                        <div class="viewport-head"><span>ASPECT // 9:16 · 1080x1920</span><span class="status">HOOK: 1.2s</span></div>
                        <div class="vp-grid-1">
                            <div class="a"><div class="h1"></div><div class="h2"></div></div>
                            <div class="b"><div class="b1"></div><div class="b2">RETENTION 72%</div></div>
                        </div>
                        <div class="vp-grid-2">
                            <div class="cell">NATIVE HOOK</div>
                            <div class="cell">PRODUCT FOCUS</div>
                            <div class="cell hl">CTA · LATE</div>
                        </div>
                    </div>
                    <p class="tk-cap-quote">"Content that feels native in the feed while keeping the product at the center — short, sharp, conversion-aware."</p>`,
            quote: '"Content that feels native in the feed while keeping the product at the center — short, sharp, conversion-aware."'
        },
        ai: {
            label: 'Agent Logic // 03',
            tag1: 'Webhook Pipeline', tag2: 'n8n + Voice',
            deliverables: 'STACK: n8n · Vapi · ElevenLabs · Supabase',
            diagram: `<div class="viewport">
                        <div class="viewport-head"><span>PIPELINE // STREAMING</span><span class="status">LATENCY &lt; 800ms</span></div>
                        <div class="vp-grid-1">
                            <div class="a"><div class="h1"></div><div class="h2"></div></div>
                            <div class="b"><div class="b1"></div><div class="b2">DISPATCH OK</div></div>
                        </div>
                        <div class="vp-grid-2">
                            <div class="cell">VOICE INTAKE</div>
                            <div class="cell">DECISION TREE</div>
                            <div class="cell hl">CRM WRITE</div>
                        </div>
                    </div>
                    <p class="tk-cap-quote">"AI systems that take real work off real hands — answering, qualifying, scheduling, and routing so the business never sleeps."</p>`,
            quote: '"AI systems that take real work off real hands — answering, qualifying, scheduling, and routing so the business never sleeps."'
        },
        growth: {
            label: 'Performance // 04',
            tag1: 'Acquisition', tag2: 'Retention',
            deliverables: 'STACK: Meta Ads · Google Ads · Custom Analytics',
            diagram: `<div class="viewport">
                        <div class="viewport-head"><span>FUNNEL // LIVE</span><span class="status">CTR 4.2%</span></div>
                        <div class="vp-grid-1">
                            <div class="a"><div class="h1"></div><div class="h2"></div></div>
                            <div class="b"><div class="b1"></div><div class="b2">ROAS 3.1x</div></div>
                        </div>
                        <div class="vp-grid-2">
                            <div class="cell">PAID CREATIVE</div>
                            <div class="cell">LTV TRACK</div>
                            <div class="cell hl">RETAIN LOOP</div>
                        </div>
                    </div>
                    <p class="tk-cap-quote">"Performance content + ad-ready creative + retention loops — the compound engine that turns a launch into a system."</p>`,
            quote: '"Performance content + ad-ready creative + retention loops — the compound engine that turns a launch into a system."'
        }
    };

    const setCap = (key) => {
        if (!capList) return;
        capList.querySelectorAll('.tk-cap-item').forEach(c => c.classList.toggle('is-active', c.dataset.cap === key));
        const c = capContent[key];
        if (!c) return;
        if (capLabel) capLabel.textContent = c.label;
        if (capTag1) capTag1.textContent = c.tag1;
        if (capTag2) capTag2.textContent = c.tag2;
        if (capDeliverables) capDeliverables.textContent = c.deliverables;
        if (capDiagram) capDiagram.innerHTML = c.diagram;
    };

    if (capList) {
        capList.querySelectorAll('.tk-cap-item').forEach(item => {
            item.addEventListener('click', () => setCap(item.dataset.cap));
            item.addEventListener('mouseenter', () => setCap(item.dataset.cap));
        });
    }

    /* ---------- Process step activation ---------- */
    const processGrid = document.getElementById('processGrid');
    if (processGrid && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    processGrid.querySelectorAll('.tk-process-card').forEach((card, i) => {
                        setTimeout(() => card.classList.add('is-active'), i * 120);
                    });
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        io.observe(processGrid);
    }

    /* ---------- UGC filter ---------- */
    const ugcFilters = document.getElementById('ugcFilters');
    const ugcGrid = document.getElementById('ugcGrid');
    if (ugcFilters && ugcGrid) {
        const applyUgc = (cat) => {
            ugcFilters.querySelectorAll('button').forEach(b => b.classList.toggle('is-active', b.dataset.ugc === cat));
            ugcGrid.querySelectorAll('.tk-reel').forEach(reel => {
                const r = reel.dataset.cat;
                reel.style.display = (cat === 'all' || r === cat) ? '' : 'none';
            });
        };
        ugcFilters.querySelectorAll('button').forEach(b => {
            b.addEventListener('click', () => applyUgc(b.dataset.ugc));
        });
        applyUgc('all');
    }

    /* ---------- Work filters (work.html) ---------- */
    const workFilters = document.querySelectorAll('.tk-work-filters button');
    const workGroups = document.querySelectorAll('.tk-work-group');
    const applyWork = (filter) => {
        workGroups.forEach(g => {
            g.classList.toggle('is-visible', filter === 'all' || g.dataset.group === filter);
        });
    };
    workFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            workFilters.forEach(b => b.classList.toggle('is-active', b === btn));
            applyWork(btn.dataset.filter);
        });
    });
    applyWork('all');

    /* ---------- Video modal (lazy) ---------- */
    const modal = document.getElementById('videoModal');
    const modalFrame = modal ? modal.querySelector('.tk-modal-frame') : null;
    const modalVideo = document.getElementById('modalVideo');
    let lastFocused = null;

    function closeModal() {
        if (!modal || !modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open');
        setTimeout(() => {
            modal.setAttribute('hidden', '');
            if (modalVideo) modalVideo.innerHTML = '';
            document.body.style.overflow = '';
        }, 400);
        if (modalFrame) modalFrame.classList.remove('vertical');
        if (lastFocused) lastFocused.focus();
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.dataset.close !== undefined) closeModal();
        });

        // Hook into project + AI cards via data-video-id
        document.querySelectorAll('[data-video-id]').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't double-handle if the card contains a real <a> link — let it open YT in new tab
                if (e.target.closest('a')) return;
                e.preventDefault();
                openVideoModal(card.dataset.videoId, false);
            });
        });
    }

    function openVideoModal(videoId, isVertical) {
        if (!modal) return;
        lastFocused = document.activeElement;
        const params = new URLSearchParams({ autoplay: '1', rel: '0', modestbranding: '1', playsinline: '1' });
        modalVideo.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?${params}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="Video"></iframe>`;
        if (isVertical) modalFrame.classList.add('vertical');
        else modalFrame.classList.remove('vertical');
        modal.removeAttribute('hidden');
        void modal.offsetWidth;
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => modal.querySelector('.tk-modal-close').focus(), 80);
    }

    /* ---------- Thumbnail fallback (maxres → hq) ---------- */
    document.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src') || '';
        const m = src.match(/i\.ytimg\.com\/vi\/([^\/]+)\/(maxresdefault|hqdefault|sddefault)\.jpg/);
        if (!m) return;
        const videoId = m[1];
        img.addEventListener('error', function handler() {
            if (img.dataset.fallbackApplied) return;
            img.dataset.fallbackApplied = '1';
            img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        }, { once: true });
    });

    /* ---------- Certificate modal (about.html) ---------- */
    const certModal = document.getElementById('certModal');
    const certModalImage = document.getElementById('modalCertImage');
    function closeCert() {
        if (!certModal || !certModal.classList.contains('is-open')) return;
        certModal.classList.remove('is-open');
        setTimeout(() => {
            certModal.setAttribute('hidden', '');
            if (certModalImage) certModalImage.innerHTML = '';
            document.body.style.overflow = '';
        }, 400);
    }
    if (certModal && certModalImage) {
        certModal.addEventListener('click', (e) => {
            if (e.target.dataset.close !== undefined) closeCert();
        });
        document.querySelectorAll('.tk-cert-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a')) return;
                const url = card.dataset.certImage;
                if (!url) return;
                certModalImage.innerHTML = `<img src="${url}" alt="Certificate" />`;
                certModal.removeAttribute('hidden');
                void certModal.offsetWidth;
                certModal.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            });
        });
    }

    /* ---------- Smooth scroll for hash links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#' || targetId.length < 2) return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 60;
            window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
        });
    });

})();