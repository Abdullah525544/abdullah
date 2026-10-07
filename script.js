/* ===========================================================
   ABDULLAH — Vanilla interactions
   · Sticky nav
   · Mobile drawer
   · Reveal on scroll
   · Work filters
   · Video modal (lazy)
   · Thumbnail fallback
   · Capabilities hover-swap
   · Process / AI line-draw reveal
   =========================================================== */

(function () {
    'use strict';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Nav scroll state ---------- */
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    const onScroll = () => {
        if (!nav) return;
        if (window.scrollY > 24) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- Mobile drawer ---------- */
    const closeMobile = () => {
        if (!navToggle) return;
        navToggle.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (navToggle) {
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
        if (e.key === 'Escape') { closeMobile(); closeModal(); }
    });

    /* ---------- Hero reveal (data-reveal-delay) ---------- */
    document.querySelectorAll('[data-reveal-delay]').forEach(el => {
        const delay = parseInt(el.dataset.revealDelay || '0', 10);
        el.style.setProperty('--reveal-delay', delay + 'ms');
        setTimeout(() => el.classList.add('is-visible'), 80 + delay);
    });
    const portrait = document.querySelector('.reveal-portrait');
    if (portrait && !portrait.hasAttribute('data-reveal-delay')) {
        setTimeout(() => portrait.classList.add('is-visible'), 240);
    }

    /* ---------- Generic reveal (IntersectionObserver) ---------- */
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    if (el.hasAttribute('data-reveal-delay')) { io.unobserve(el); return; }
                    const baseDelay = parseInt(el.dataset.delay || '0', 10);
                    const stagger = i * 60;
                    el.style.setProperty('--reveal-delay', (baseDelay + stagger) + 'ms');
                    setTimeout(() => el.classList.add('is-visible'), baseDelay);
                    io.unobserve(el);
                }
            });
        }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal').forEach(el => {
            if (!el.hasAttribute('data-reveal-delay')) io.observe(el);
        });
        if (portrait && !portrait.hasAttribute('data-reveal-delay')) io.observe(portrait);
    } else {
        document.querySelectorAll('.reveal:not(.is-visible), .reveal-portrait:not(.is-visible)')
            .forEach(el => el.classList.add('is-visible'));
    }

    /* ---------- Capabilities hover swap ---------- */
    const capList = document.getElementById('capList');
    if (capList) {
        const rows = capList.querySelectorAll('.cap-row');
        const imgs = document.querySelectorAll('[data-cap-img]');
        const label = document.getElementById('capLabel');
        const title = document.getElementById('capTitle');
        const desc = document.getElementById('capDesc');
        const meta = {
            web: { label: 'Website', title: 'Web Design', desc: 'Modern websites designed around the brand, user experience and business goal.' },
            content: { label: 'UGC', title: 'UGC & Product Content', desc: 'Short-form content designed to feel native in the feed. Hair care, skincare, watch, fragrance.' },
            ai: { label: 'AI System', title: 'AI Systems', desc: 'Practical AI workflows — voice agents, CRM logic, n8n automation — that reduce manual work.' },
            growth: { label: 'CRM & Growth', title: 'Growth & Marketing', desc: 'Digital marketing with AI — performance content and ad-ready creative.' }
        };

        const setCap = (key) => {
            rows.forEach(r => r.classList.toggle('is-active', r.dataset.cap === key));
            imgs.forEach(img => img.classList.toggle('is-on', img.dataset.capImg === key));
            const m = meta[key]; if (!m) return;
            if (label) label.textContent = m.label;
            if (title) title.textContent = m.title;
            if (desc) desc.textContent = m.desc;
        };

        rows.forEach(row => {
            row.addEventListener('mouseenter', () => setCap(row.dataset.cap));
            row.addEventListener('focus', () => setCap(row.dataset.cap));
            row.addEventListener('click', () => setCap(row.dataset.cap));
        });
    }

    /* ---------- Think timeline reveal ---------- */
    const think = document.getElementById('thinkTimeline');
    if (think) {
        if (prefersReduced) {
            think.classList.add('is-on');
            think.querySelectorAll('.think-step').forEach(s => s.classList.add('is-on'));
        } else if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        think.classList.add('is-on');
                        think.querySelectorAll('.think-step').forEach((s, i) => {
                            setTimeout(() => s.classList.add('is-on'), 200 + i * 120);
                        });
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });
            io.observe(think);
        }
    }

    /* ---------- AI flow reveal ---------- */
    const ai = document.getElementById('aiFlow');
    if (ai) {
        if (prefersReduced) {
            ai.classList.add('is-on');
            ai.querySelectorAll('.ai-step').forEach(s => s.classList.add('is-on'));
        } else if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        ai.classList.add('is-on');
                        ai.querySelectorAll('.ai-step').forEach((s, i) => {
                            setTimeout(() => s.classList.add('is-on'), 200 + i * 200);
                        });
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });
            io.observe(ai);
        }
    }

    /* ---------- Work filters ---------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workGroups = document.querySelectorAll('.work-group');

    const applyFilter = (filter) => {
        workGroups.forEach(group => {
            const cat = group.dataset.group;
            const show = filter === 'all' || cat === filter;
            group.classList.toggle('is-visible', show);
        });
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

    /* ---------- Video modal (lazy) ---------- */
    const modal = document.getElementById('videoModal');
    const modalFrame = modal ? modal.querySelector('.modal-frame') : null;
    const modalVideo = document.getElementById('modalVideo');
    let lastFocused = null;

    const closeModal = () => {
        if (!modal || !modal.classList.contains('is-open')) return;
        modal.classList.remove('is-open');
        setTimeout(() => {
            modal.setAttribute('hidden', '');
            if (modalVideo) modalVideo.innerHTML = '';
            document.body.style.overflow = '';
        }, 400);
        if (modalFrame) modalFrame.classList.remove('vertical');
        if (lastFocused) lastFocused.focus();
    };

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.dataset.close !== undefined) closeModal();
        });

        document.querySelectorAll('[data-video-id]').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const videoId = card.dataset.videoId;
                const isVertical = card.classList.contains('ugc-card');
                lastFocused = document.activeElement;
                const params = new URLSearchParams({ autoplay: '1', rel: '0', modestbranding: '1', playsinline: '1' });
                modalVideo.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?${params}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="Video"></iframe>`;
                if (isVertical) modalFrame.classList.add('vertical');
                else modalFrame.classList.remove('vertical');
                modal.removeAttribute('hidden');
                void modal.offsetWidth;
                modal.classList.add('is-open');
                document.body.style.overflow = 'hidden';
                setTimeout(() => modal.querySelector('.modal-close').focus(), 80);
            });
        });
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
    if (certModal && certModalImage) {
        const closeCert = () => {
            if (!certModal.classList.contains('is-open')) return;
            certModal.classList.remove('is-open');
            setTimeout(() => {
                certModal.setAttribute('hidden', '');
                certModalImage.innerHTML = '';
                document.body.style.overflow = '';
            }, 400);
        };
        certModal.addEventListener('click', (e) => {
            if (e.target.dataset.close !== undefined) closeCert();
        });
        document.querySelectorAll('.cert-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.cert-verify')) return;
                const url = card.dataset.certImage;
                if (!url) return;
                certModalImage.innerHTML = `<img src="${url}" alt="Certificate" />`;
                certModal.removeAttribute('hidden');
                void certModal.offsetWidth;
                certModal.classList.add('is-open');
                document.body.style.overflow = 'hidden';
                setTimeout(() => certModal.querySelector('.modal-close').focus(), 80);
            });
        });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCert(); });
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