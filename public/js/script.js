// ══════════════════════════════════════════════════════════════
// MIDNIGHT AURORA — Premium Portfolio JavaScript
// Shahzad Khan | Full Stack Developer
// ══════════════════════════════════════════════════════════════
(function () {
    'use strict';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ═══════════════════════════════════════════
    // 0. PRELOADER
    // ═══════════════════════════════════════════
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
                // Remove from DOM after transition
                setTimeout(() => preloader.remove(), 700);
            }, reducedMotion ? 0 : 600);
        });
    }

    // ═══════════════════════════════════════════
    // 1. THEME TOGGLE
    // ═══════════════════════════════════════════
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    if (currentTheme === 'light') {
        document.documentElement.classList.add('light-mode');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.documentElement.classList.contains('light-mode');
            if (isLight) {
                document.documentElement.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                document.documentElement.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        });
    }

    // ═══════════════════════════════════════════
    // 2. CUSTOM CURSOR
    // ═══════════════════════════════════════════
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    if (dot && ring && window.matchMedia('(hover: hover)').matches) {
        let mx = -100, my = -100, rx = -100, ry = -100;

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
        });

        function cursorLoop() {
            // Smooth follow with lerp
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            dot.style.left = mx + 'px';
            dot.style.top = my + 'px';
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            requestAnimationFrame(cursorLoop);
        }
        cursorLoop();

        // Interactive element hover
        const interactives = document.querySelectorAll('a, button, .btn, .project-card, .skill-card, .cert-card, .social-icon, .contact-item');
        interactives.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
                document.body.classList.remove('cursor-text');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });

        // Text input cursor mode
        const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
        textInputs.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-text');
                document.body.classList.remove('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-text');
            });
        });

        document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
        document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));
    }

    // ═══════════════════════════════════════════
    // 3. MOBILE MENU
    // ═══════════════════════════════════════════
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenu && navList) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navList.classList.toggle('active');
            document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
        });
        // Also handle keyboard
        mobileMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                mobileMenu.click();
            }
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (navList) navList.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ═══════════════════════════════════════════
    // 4. NAVBAR SCROLL + ACTIVE LINK
    // ═══════════════════════════════════════════
    const header = document.getElementById('header');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (header) {
                    header.classList.toggle('scrolled', window.scrollY > 50);
                }
                // Active link highlighting
                const sections = document.querySelectorAll('section[id]');
                let current = '';
                sections.forEach((s) => {
                    if (window.scrollY >= s.offsetTop - 200) current = s.id;
                });
                navLinks.forEach((l) => {
                    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    // ═══════════════════════════════════════════
    // 5. GSAP SCROLL REVEAL
    // ═══════════════════════════════════════════
    if (typeof gsap !== 'undefined' && !reducedMotion) {
        gsap.registerPlugin(ScrollTrigger);

        // Staggered reveal for .gs-reveal elements
        gsap.utils.toArray('.gs-reveal').forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
                    delay: (i % 5) * 0.08
                }
            );
        });

        // Hero parallax — image moves slower on scroll
        const heroImg = document.querySelector('.hero-img-frame');
        if (heroImg) {
            gsap.to(heroImg, {
                y: 80,
                scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 }
            });
        }

        // Contact form fields float in sequentially
        gsap.utils.toArray('.contact-form .form-group').forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, y: 30, x: -10 },
                {
                    opacity: 1, y: 0, x: 0,
                    duration: 0.7, ease: 'power2.out',
                    scrollTrigger: { trigger: el, start: 'top 92%', once: true },
                    delay: i * 0.12
                }
            );
        });

        // Section dividers fade in
        gsap.utils.toArray('.section-divider').forEach((el) => {
            gsap.fromTo(el,
                { scaleX: 0, opacity: 0 },
                {
                    scaleX: 1, opacity: 1,
                    duration: 1.2, ease: 'power2.out',
                    scrollTrigger: { trigger: el, start: 'top 95%', once: true }
                }
            );
        });

        // Timeline items slide in from left
        gsap.utils.toArray('.timeline-item').forEach((el, i) => {
            gsap.fromTo(el,
                { opacity: 0, x: -30 },
                {
                    opacity: 1, x: 0,
                    duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
                    delay: i * 0.15
                }
            );
        });
    } else {
        // No GSAP or reduced motion — show everything
        document.querySelectorAll('.gs-reveal').forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    // ═══════════════════════════════════════════
    // 6. ANIMATED STAT COUNTERS
    // ═══════════════════════════════════════════
    const statNums = document.querySelectorAll('.stat-num[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNums.forEach((el) => counterObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 1500;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current + '+';
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // ═══════════════════════════════════════════
    // 7. 3D TILT ON PROJECT CARDS
    // ═══════════════════════════════════════════
    if (!reducedMotion) {
        document.querySelectorAll('[data-tilt]').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-8px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
                card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
                setTimeout(() => (card.style.transition = ''), 500);
            });
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });
    }

    // ═══════════════════════════════════════════
    // 8. CARD GLOW FOLLOW (Mouse tracking on cards)
    // ═══════════════════════════════════════════
    if (!reducedMotion) {
        const glowCards = document.querySelectorAll('.skill-card, .project-card');
        glowCards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', x + '%');
                card.style.setProperty('--mouse-y', y + '%');
            });
        });
    }

    // ═══════════════════════════════════════════
    // 9. MAGNETIC BUTTONS
    // ═══════════════════════════════════════════
    if (!reducedMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.btn-primary, .btn-outline, .about-resume-btn').forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
                // Set ripple position
                const rx = ((e.clientX - rect.left) / rect.width) * 100;
                const ry = ((e.clientY - rect.top) / rect.height) * 100;
                btn.style.setProperty('--ripple-x', rx + '%');
                btn.style.setProperty('--ripple-y', ry + '%');
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
                setTimeout(() => (btn.style.transition = ''), 400);
            });
            btn.addEventListener('mouseenter', () => {
                btn.style.transition = 'none';
            });
        });
    }

    // ═══════════════════════════════════════════
    // 10. FOOTER REPEL EFFECT
    // ═══════════════════════════════════════════
    if (!reducedMotion) {
        document.querySelectorAll('.footer-links a').forEach((a) => {
            a.addEventListener('mouseenter', function () {
                const siblings = this.parentElement.querySelectorAll('a');
                siblings.forEach((s) => {
                    if (s !== this)
                        s.style.transform = s.compareDocumentPosition(this) & 4 ? 'translateX(-6px)' : 'translateX(6px)';
                });
            });
            a.addEventListener('mouseleave', function () {
                this.parentElement.querySelectorAll('a').forEach((s) => (s.style.transform = ''));
            });
        });
    }

    // ═══════════════════════════════════════════
    // 11. SMOOTH SCROLL (Enhanced)
    // ═══════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ═══════════════════════════════════════════
    // 12. CONTACT FORM
    // ═══════════════════════════════════════════
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showStatus('Please fill all fields.', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showStatus('Enter a valid email.', 'error');
                return;
            }

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
            btn.disabled = true;
            btn.style.opacity = '0.7';

            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });
                const data = await res.json();
                if (res.ok) {
                    showStatus('✓ Message sent! I\'ll get back to you soon.', 'success');
                    form.reset();
                    // Particle burst on success
                    const rect = btn.getBoundingClientRect();
                    if (window.particleBurst) window.particleBurst(rect.left + rect.width / 2, rect.top);
                } else {
                    showStatus('Failed: ' + (data.message || 'Unknown error'), 'error');
                }
            } catch {
                showStatus('Network error. Try again later.', 'error');
            } finally {
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                btn.disabled = false;
                btn.style.opacity = '';
            }
        });
    }

    function showStatus(msg, type) {
        if (!status) return;
        status.textContent = msg;
        status.style.color = type === 'success' ? 'var(--accent)' : '#f87171';
        status.style.fontSize = 'var(--fs-sm)';
        status.style.fontFamily = 'var(--font-mono)';
        status.style.marginTop = '8px';
        // Fade in
        status.style.opacity = '0';
        requestAnimationFrame(() => {
            status.style.transition = 'opacity 0.3s ease';
            status.style.opacity = '1';
        });
        setTimeout(() => {
            status.style.opacity = '0';
            setTimeout(() => { status.textContent = ''; }, 300);
        }, 5000);
    }

    // ═══════════════════════════════════════════
    // 13. FLOATING GEOMETRIC SHAPES PARALLAX
    // ═══════════════════════════════════════════
    if (!reducedMotion) {
        const shapes = document.querySelectorAll('.geo-shape');
        if (shapes.length > 0) {
            document.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 2;
                const y = (e.clientY / window.innerHeight - 0.5) * 2;
                shapes.forEach((shape, i) => {
                    const speed = (i + 1) * 8;
                    shape.style.transform += ` translate(${x * speed}px, ${y * speed}px)`;
                });
            });
        }
    }
    // ═══════════════════════════════════════════
    // 14. ANIMATED TYPEWRITER HEADLINE
    // ═══════════════════════════════════════════
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const roles = [
            "Full Stack Development",
            "AI Engineering & LLMs",
            "Content Writing & Copywriting",
            "Building Ideas into Reality 🚀"
        ];
        let roleIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function typeLoop() {
            const currentRole = roles[roleIdx];
            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIdx - 1);
                charIdx--;
                typeSpeed = 40;
            } else {
                typingElement.textContent = currentRole.substring(0, charIdx + 1);
                charIdx++;
                typeSpeed = 90;
            }

            if (!isDeleting && charIdx === currentRole.length) {
                typeSpeed = 2200; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                typeSpeed = 400; // Pause before typing next
            }

            setTimeout(typeLoop, typeSpeed);
        }
        typeLoop();
    }

    // ═══════════════════════════════════════════
    // 15. HERO TERMINAL TAB SWITCHER
    // ═══════════════════════════════════════════
    const termTabs = document.querySelectorAll('.terminal-tab');
    const termPanes = document.querySelectorAll('.terminal-pane');

    termTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const targetId = 'tab-' + tab.getAttribute('data-tab');
            termTabs.forEach(t => t.classList.remove('active'));
            termPanes.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    // ═══════════════════════════════════════════
    // 16. PROJECT CATEGORY FILTER
    // ═══════════════════════════════════════════
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.projects-grid .project-card');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            projectCards.forEach((card) => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hide-card');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'all 0.35s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.classList.add('hide-card');
                }
            });
        });
    });

    // ═══════════════════════════════════════════
    // 17. PROJECT CASE STUDY MODAL DIALOG
    // ═══════════════════════════════════════════
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = document.getElementById('modal-backdrop');

    const projectData = {
        1: {
            title: "AI Content & Copy Assistant",
            category: "AI Engineering & Full Stack",
            description: "An intelligent web application that uses OpenAI's GPT-4 API to generate high-converting sales copy, SEO articles, and blog post ideas tailored to brand guidelines.",
            challenge: "Marketing teams spent hours writing initial draft content and optimizing for search engines.",
            solution: "Engineered a custom prompt pipeline with structured JSON outputs, streaming responses, and automated SEO meta tag generation.",
            outcome: "75% reduction in draft creation time, 99.4% prompt consistency across brand tones.",
            tech: ["Node.js", "OpenAI API", "Express", "JavaScript", "HTML5", "CSS3"],
            github: "https://github.com"
        },
        2: {
            title: "Enterprise Full-Stack Web Portal",
            category: "Full Stack & Web Architecture",
            description: "A comprehensive enterprise portal engineered with PHP backend logic and MySQL database integration for managing system users, assets, and operational logs.",
            challenge: "Managing complex data structures and maintaining sub-second response times for high-concurrency requests.",
            solution: "Designed normalized 3NF database schema, implemented server-side caching, and optimized SQL query execution paths.",
            outcome: "Sub-50ms API response latency and 40% improvement in load performance.",
            tech: ["PHP", "MySQL", "JavaScript", "Bootstrap", "REST API"],
            github: "https://github.com"
        },
        3: {
            title: "SaaS Conversion Copy & SEO Growth",
            category: "Copywriting & Digital Strategy",
            description: "Complete copy overhaul and SEO strategy for a digital product launch, including value proposition design, landing page headlines, and feature messaging.",
            challenge: "Low landing page conversion rate and minimal organic search engine visibility.",
            solution: "Applied psychological copywriting principles (PAS & AIDA frameworks) alongside structured semantic HTML and keyword optimization.",
            outcome: "+65% organic search traffic lift and +42% user signup conversion rate.",
            tech: ["Conversion Copywriting", "SEO Strategy", "Brand Messaging", "Content Marketing"],
            github: null
        },
        4: {
            title: "Java OOP Inventory Management System",
            category: "Java & Systems Programming",
            description: "A robust desktop software application built in Java demonstrating core Object-Oriented Programming (OOP) concepts such as Inheritance, Polymorphism, and Encapsulation.",
            challenge: "Building a reliable desktop application capable of processing transactional records safely.",
            solution: "Architected modular class hierarchies, file-IO persistence, and GUI interfaces with strict exception handling.",
            outcome: "Zero memory leaks, clean modular code design, and 100% test coverage for core business logic.",
            tech: ["Java", "OOP", "Design Patterns", "SQL Integration", "GUI"],
            github: "https://github.com"
        },
        5: {
            title: "SQL Analytics & Schema Optimizer",
            category: "Database Engineering & SQL",
            description: "A database performance tuning project focusing on query indexing, relational database normalization, and query plan execution optimization.",
            challenge: "Slow database reporting queries causing dashboard timeouts on datasets exceeding 100k records.",
            solution: "Rewrote un-indexed JOIN statements, created composite indexes, and normalized table structures.",
            outcome: "Query runtime dropped from 3.8s down to 0.4s (60%+ execution speedup).",
            tech: ["MySQL", "PostgreSQL", "SQL Server", "Query Optimization", "Database Normalization"],
            github: "https://github.com"
        },
        6: {
            title: "RAG Knowledge Base Assistant",
            category: "AI Engineering & Vector Search",
            description: "A Retrieval-Augmented Generation (RAG) assistant designed to ingest technical documentation and answer user questions with accurate, context-bound responses.",
            challenge: "LLMs hallucinating inaccurate information when queried on specialized internal documentation.",
            solution: "Built a vector embedding pipeline with chunking strategies and semantic search retrieval prior to prompt context insertion.",
            outcome: "99% factual precision with complete provenance attribution for every generated answer.",
            tech: ["Python", "OpenAI API", "Vector Databases", "LangChain", "REST APIs"],
            github: "https://github.com"
        }
    };

    document.querySelectorAll('.view-modal-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projId = btn.getAttribute('data-project');
            const data = projectData[projId];
            if (!data || !modal || !modalBody) return;

            modalBody.innerHTML = `
                <span class="showcase-badge"><i class="fas fa-cube"></i> ${data.category}</span>
                <h3>${data.title}</h3>
                <p>${data.description}</p>

                <div class="modal-section-title">The Challenge</div>
                <p>${data.challenge}</p>

                <div class="modal-section-title">The Solution</div>
                <p>${data.solution}</p>

                <div class="modal-section-title">Key Outcome &amp; Impact</div>
                <p><strong>${data.outcome}</strong></p>

                <div class="modal-section-title">Tech Stack &amp; Skills</div>
                <div class="modal-tech-list">
                    ${data.tech.map(t => `<span>${t}</span>`).join('')}
                </div>

                ${data.github ? `<a href="${data.github}" target="_blank" class="btn btn-primary" style="margin-top:10px;"><i class="fab fa-github"></i> View GitHub Repository</a>` : ''}
            `;

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

})();
