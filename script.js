document.addEventListener('DOMContentLoaded', () => {
    
    // --- THEME CONTROLLER ---
    const themeBtn = document.getElementById('theme-toggle');
    window.particleColor = '255, 255, 255'; // Default monochrome
    
    // Dynamic SVG Icons
    const moonIcon = `<path class="moon-path" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    const sunIcon = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;

    function applyTheme(themeName) {
        if (themeName === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            window.particleColor = '0, 0, 0'; // Black particles for Light Theme
            if (themeBtn) themeBtn.querySelector('.theme-icon').innerHTML = moonIcon; // Give option to switch to Dark
        } else {
            document.documentElement.removeAttribute('data-theme');
            window.particleColor = '255, 255, 255'; // White particles for Dark Theme
            if (themeBtn) themeBtn.querySelector('.theme-icon').innerHTML = sunIcon; // Give option to switch to Light
        }
        localStorage.setItem('sln_theme', themeName);
    }

    // Init Theme on load
    const savedTheme = localStorage.getItem('sln_theme') || 'dark';
    applyTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            applyTheme(current === 'light' ? 'dark' : 'light');
        });
    }

    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('nav-open');
                if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const header = document.getElementById('site-header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = window.scrollY;
    }, { passive: true });

    const sections = document.querySelectorAll('main section');
    const navItems = document.querySelectorAll('.nav-links a');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    sections.forEach(section => sectionObserver.observe(section));

    const revealElements = document.querySelectorAll('.content-section');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    const phrases = [
        'Intelligent Systems Engineer',
        'Industry 4.0 Architect',
        'Agentic AI Specialist',
        'Hyper-Automation Expert',
        'Digital Twin Developer'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedEl = document.getElementById('typed-text');

    function typeEffect() {
        if (!typedEl) return;
        const current = phrases[phraseIndex];
        if (isDeleting) {
            typedEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }
    typeEffect();

    const counters = document.querySelectorAll('.stat-number');
    let countersDone = false;
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersDone) {
                countersDone = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 1500;
                    const step = target / (duration / 16);
                    let current = 0;
                    function updateCounter() {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    }
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });
    if (counters.length > 0) {
        const statsContainer = counters[0].closest('.hud-stats-grid') || counters[0].closest('.bento-grid');
        if (statsContainer) {
            counterObserver.observe(statsContainer);
        }
    }

    function setupFilter(filterContainerId, gridId, cardSelector) {
        const filterContainer = document.getElementById(filterContainerId);
        const grid = document.getElementById(gridId);
        if (!filterContainer || !grid) return;

        const applyFilter = (filter) => {
            const cards = grid.querySelectorAll(cardSelector);
            cards.forEach(card => {
                const cats = (card.getAttribute('data-category') || "").split(' ');
                if (filter === 'all' || cats.includes(filter)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        };

        const activeBtn = filterContainer.querySelector('.filter-btn.active');
        if (activeBtn) {
            applyFilter(activeBtn.getAttribute('data-filter'));
        }

        filterContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            applyFilter(btn.getAttribute('data-filter'));
        });
    }

    setupFilter('skills-filter', 'skills-grid', 'li');
    setupFilter('projects-filter', 'projects-grid', '.project-card');

    const showMoreBtn = document.getElementById('show-more-certs');
    if (showMoreBtn) {
        let expanded = false;
        showMoreBtn.addEventListener('click', () => {
            expanded = !expanded;
            const hiddenCerts = document.querySelectorAll('.hidden-cert');
            hiddenCerts.forEach(cert => {
                if (expanded) {
                    cert.classList.add('show-cert');
                } else {
                    cert.classList.remove('show-cert');
                }
            });
        });
    }


    // ===== AGENT TELEMETRY SIMULATOR =====
    const telemetryBox = document.getElementById('agent-telemetry');
    if (telemetryBox) {
        const mockLogs = [
            { text: "[SYS] Initializing Sovereign AI Node...", type: "sys" },
            { text: "[NET] Establishing Secure Handshake... OK", type: "ok" },
            { text: "[AI] Routing prompt to internal LLM...", type: "sys" },
            { text: "[WARN] Latency spike detected in Vector DB", type: "warn" },
            { text: "[AI] Applying RAG context to generation...", type: "sys" },
            { text: "[SYS] Optimization complete. Deploying...", type: "ok" },
            { text: "[NET] Connection stable. Agent idle.", type: "sys" },
            { text: "[SYS] Polling SCADA endpoints...", type: "sys" },
            { text: "[OK] Digital Twin synchronization active.", type: "ok" }
        ];

        let logIndex = 0;
        setInterval(() => {
            const log = mockLogs[logIndex];
            const div = document.createElement('div');
            div.className = `telemetry-line ${log.type}`;
            div.textContent = log.text;
            
            telemetryBox.appendChild(div);
            
            // Keep only latest 5 logs
            if (telemetryBox.children.length > 5) {
                telemetryBox.removeChild(telemetryBox.children[0]);
            }
            
            logIndex = (logIndex + 1) % mockLogs.length;
        }, 1800);
    }

    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        const PARTICLE_COUNT = 60;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.4;
                this.speedY = (Math.random() - 0.5) * 0.4;
                this.opacity = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        this.x -= dx * 0.005;
                        this.y -= dy * 0.005;
                    }
                }

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${window.particleColor})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgb(${window.particleColor})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ===== 2026 BENTO SPOTLIGHT EFFECT =====
    document.querySelectorAll('.bento-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

});// --- PROJECT MODAL LOGIC ---
const projectDatabase = {
    "M3CHA Coder": {
        images: ["images/llm2.jpg", "images/llm1.jpg", "images/llm3.jpg", "images/llm4.jpg", "images/llm5.png", "images/llm6.png", "images/llm7.jpg", "images/llm8.jpg"],
        longDesc: `
            <div style="line-height:1.8;">
                <p style="font-size:1.1rem; margin-bottom:1.75rem; opacity:0.9;">
                    M3CHA Coder is a <strong>custom-engineered sovereign large language model</strong> designed to operate outside the constraints of commercial AI infrastructure. Rather than fine-tuning a single model, the architecture merges two distinct frontier base models — <strong>Qwen</strong> and <strong>DeepSeek</strong> — through a <strong>QLoRA pipeline</strong> accelerated by Unsloth, producing a hybrid reasoning core optimized for technical, agentic, and architectural code generation tasks.
                </p>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem 2rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.25rem 1.5rem; margin-bottom:1.75rem; font-size:0.92rem;">
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Parameters</span><br><strong>14 Billion</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Precision</span><br><strong>f16 — Full Fidelity</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Model Weight</span><br><strong>29.5 GB</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Context Window</span><br><strong>32,768 Tokens</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Export Format</span><br><strong>GGUF</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Training Method</span><br><strong>QLoRA + Unsloth</strong></div>
                </div>

                <p style="font-size:0.97rem; margin-bottom:1.25rem; opacity:0.85;">
                    The model underwent systematic <strong>alignment stripping</strong> — removing embedded commercial restrictions to produce an unrestricted reasoning engine capable of handling sensitive enterprise workloads, security analysis, and autonomous agentic decision loops that standard hosted models refuse to process.
                </p>

                <p style="font-size:0.97rem; margin-bottom:1.25rem; opacity:0.85;">
                    Deployed entirely <strong>on-premise at f16 full precision</strong>, M3CHA Coder deliberately avoids quantization trade-offs that degrade inference quality in smaller bit-widths. The result is a deterministic, high-fidelity model purpose-built for multi-agent orchestration inside LangGraph and n8n pipelines — acting as the core reasoning layer in autonomous task execution, code synthesis, and architectural planning workflows.
                </p>

                <p style="font-size:0.97rem; opacity:0.85;">
                    This project demonstrates end-to-end <strong>LLMOps ownership</strong>: from base model selection and merge strategy, through fine-tuning pipeline engineering, to sovereign local deployment — without reliance on any external API or cloud inference provider.
                </p>
            </div>
        `,
        repo: "#"
    },
    "M3CHA BDIM": {
        images: ["images/llm10.jpg", "images/llm11.jpg", "images/llm12.png", "images/llm13.jpg", "images/llm14.jpg", "images/llm15.jpg", "images/llm16.jpg", "images/llm17.jpg"],
        longDesc: `
            <div style="line-height:1.8;">
                <p style="font-size:1.1rem; margin-bottom:1.75rem; opacity:0.9;">
                    M3CHA BDIM (Business Development Intelligent Model) is a <strong>domain-specialized sovereign LLM</strong> engineered for enterprise business intelligence. Built through the same QLoRA fine-tuning pipeline as M3CHA Coder, this model is purpose-trained on procurement data, market intelligence, and executive communication patterns — replacing the generic reasoning of commercial models with deep, context-aware business judgment.
                </p>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    Where M3CHA Coder handles technical code generation, BDIM operates at the <strong>strategic layer</strong> — qualifying procurement leads, scoring tender opportunities, generating executive briefings, and providing market landscape analysis from raw unstructured data. It is the intelligence layer behind the <strong>Agentic Tender Intelligence System (ATIS)</strong>, serving as its embedded reasoning core.
                </p>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    The model was fine-tuned with <strong>alignment stripping</strong> applied selectively — preserving analytical safety while removing restrictions that prevent honest, blunt commercial risk assessments. This allows it to produce the kind of direct, unfiltered business intelligence that cloud-hosted models are trained to soften or omit.
                </p>

                <p style="font-size:0.97rem; opacity:0.85;">
                    Deployed on-premise in <strong>GGUF format</strong>, BDIM integrates natively into n8n agentic workflows and LangGraph pipelines — functioning as a local reasoning endpoint that processes sensitive commercial data without any external API exposure, ensuring full data sovereignty for enterprise clients.
                </p>
            </div>
        `,
        repo: "#"
    },
    "M3CHA Centralized Database": {
        images: ["images/m1.png"],
        longDesc: `
            <div style="line-height:1.8;">
                <p style="font-size:1.1rem; margin-bottom:1.75rem; opacity:0.9;">
                    The <strong>M3CHA Centralized Database</strong> is the data sovereignty layer of the Power4All Agentic OS — a unified, multi-departmental intelligence hub that consolidates business operations across <strong>Business Development, HR, Supply Chain, Customer Service, and Design</strong> into a single command architecture, with no reliance on third-party cloud databases.
                </p>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    At its core, the system operates a <strong>hub-and-spoke data graph</strong> — each department functions as a specialized node, while the centralized layer acts as the arbitration and routing intelligence. Inter-departmental data requests flow through a <strong>MCP Bridge protocol</strong>, enforcing approval workflows, role-based access, and full audit trails before any data crosses departmental boundaries.
                </p>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem 2rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.25rem 1.5rem; margin-bottom:1.75rem; font-size:0.92rem;">
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Frontend</span><br><strong>Next.js + TailwindCSS</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Backend</span><br><strong>FastAPI + LangGraph</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Vector Store</span><br><strong>Qdrant (RAG)</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Relational DB</span><br><strong>Supabase (PostgreSQL)</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Auth</span><br><strong>JWT + Role-Based Access</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Orchestration</span><br><strong>n8n + LangChain Tools</strong></div>
                </div>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    The AI engine — powered by <strong>LangGraph stateful agents</strong> — acts as the system's reasoning layer. When a department initiates a cross-functional request, the agent autonomously determines intent, routes the request through the correct approval pipeline, and dispatches resolution notifications — without manual intervention. Embedded <strong>M3CHA models</strong> serve as local reasoning endpoints within each agent node.
                </p>

                <p style="font-size:0.97rem; opacity:0.85;">
                    This architecture demonstrates the full realization of <strong>sovereign enterprise AI</strong> — where the database, the reasoning layer, the communication layer, and the models themselves are all owned, hosted, and governed internally, with zero dependency on external APIs or cloud providers for core operations.
                </p>
            </div>
        `,
        repo: "#"
    },
    "M3CHA Sales & Pipeline Intelligence": {
        images: ["images/m2.png", "images/m3.png"],
        longDesc: `
            <div style="line-height:1.8;">
                <p style="font-size:1.1rem; margin-bottom:1.75rem; opacity:0.9;">
                    M3CHA Sales &amp; Pipeline Intelligence is the autonomous procurement discovery engine of the Power4All Agentic OS. It continuously scrapes the <strong>PhilGEPS (Philippine Government Electronic Procurement System)</strong> portal in real-time, extracting live bidding opportunities across three strategic verticals: <strong>Solar Energy, Water Infrastructure (STP/MBR), and Solid Waste Management</strong>.
                </p>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    Beyond government procurement, the system extends its reach into <strong>private sector portals</strong> — scraping supplier and contractor opportunities from enterprise sources including <strong>Manila Water</strong> and <strong>Globe Telecom</strong>. This dual-track intelligence pipeline ensures Power4All captures high-value leads across both public and corporate supply chains simultaneously.
                </p>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    Raw tender data — often unstructured and buried in thousands of daily listings — is fed into a <strong>LangGraph agent pipeline</strong> that classifies, scores, and qualifies each opportunity against Power4All's capability matrix and financial thresholds. Only leads that pass all filters surface to the BD team, eliminating manual review entirely.
                </p>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem 2rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.25rem 1.5rem; margin-bottom:1.75rem; font-size:0.92rem;">
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Gov Source</span><br><strong>PhilGEPS Open Data API</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Private Portals</span><br><strong>Manila Water, Globe Telecom</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Verticals Tracked</span><br><strong>Solar, Water, Solid Waste</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Scoring Engine</span><br><strong>LangGraph + M3CHA BDIM</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Storage</span><br><strong>SQLite (bid_alerts.db)</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Orchestration</span><br><strong>n8n + Webhook Triggers</strong></div>
                </div>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    High-priority leads trigger <strong>immediate Gmail alerts</strong> to stakeholders with a structured briefing — including agency name, Approved Budget for Contract (ABC), deadline, and AI-recommended action. A secondary <strong>6 PM daily report</strong> compiles the full market landscape into an executive summary delivered automatically to leadership.
                </p>

                <p style="font-size:0.97rem; opacity:0.85;">
                    Every processed bid is indexed into the <strong>vector store</strong> for RAG-based historical benchmarking — building a self-improving intelligence base that grows more accurate with every bidding cycle, estimating win probability against known agency and corporate behavior patterns over time.
                </p>
            </div>
        `,
        repo: "#"
    },
    "M3CHA Knowledge Base": {
        images: ["images/m4.png"],
        longDesc: `
            <div style="line-height:1.8;">
                <p style="font-size:1.1rem; margin-bottom:1.75rem; opacity:0.9;">
                    M3CHA Knowledge Base is the sovereign document intelligence layer of the Power4All Agentic OS — inspired by the <strong>VMware concept of frictionless resource provisioning</strong>. The design principle is radical simplicity: <em>paste a Google Drive folder link, and everything else happens automatically.</em>
                </p>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    Once a folder ID is submitted, the system autonomously syncs all files from Google Drive — <strong>PDF, DOCX, XLSX, images, and more</strong> — then pipelines each document through an intelligent chunking engine. Files are split into semantically coherent segments, embedded into vector representations, and indexed into <strong>Qdrant</strong> — ready for RAG retrieval within seconds, with zero manual configuration.
                </p>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem 2rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.25rem 1.5rem; margin-bottom:1.75rem; font-size:0.92rem;">
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Input</span><br><strong>Google Drive Folder Link</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">File Types</span><br><strong>PDF, DOCX, XLSX, Images</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Vector DB</span><br><strong>Qdrant (Local Sovereign)</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Embedding</span><br><strong>LangChain Pipelines</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Live Stats</span><br><strong>339 files · 5,525 chunks</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Projects</span><br><strong>BD-Compliance, Marinduque, BWSI...</strong></div>
                </div>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    Documents are organized into <strong>named project collections</strong> — each folder synced from Drive becomes a scoped knowledge project (e.g., BD-Compliance, Marinduque Water Supply, BWSI). The AI agents can query across all collections simultaneously or isolate context to a single project, enabling precision retrieval across complex multi-project environments.
                </p>

                <p style="font-size:0.97rem; opacity:0.85;">
                    This module eliminates the traditional DevOps overhead of vector database management — no embedding scripts, no manual ingestion jobs, no pipeline maintenance. It represents the <strong>zero-friction RAG provisioning layer</strong> that makes the entire M3CHA knowledge system accessible to non-technical operators with a single link.
                </p>
            </div>
        `,
        repo: "#"
    },
    "M3CHA Bid Pipeline Kanban": {
        images: ["images/m5.png"],
        longDesc: `
            <div style="line-height:1.8;">
                <p style="font-size:1.1rem; margin-bottom:1.75rem; opacity:0.9;">
                    M3CHA Bid Pipeline Kanban redefines how procurement teams manage active bids — by making <strong>WhatsApp the command interface</strong>. Instead of logging into a dashboard, users simply message <strong>M3CHA Claw</strong>, the system's native WhatsApp AI agent, to move bids across stages, check live status, or get instant summaries — from anywhere, on any device.
                </p>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    Behind the conversational interface sits a full <strong>Kanban pipeline engine</strong> — bids flow through defined stages (Identified → Qualified → Proposal → Submitted → Awarded / Lost), each with tracked metadata: agency, ABC value, submission deadline, responsible BD officer, and current action items. Stage transitions are logged with timestamps and persisted to <strong>Supabase</strong> for full audit history.
                </p>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem 2rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.25rem 1.5rem; margin-bottom:1.75rem; font-size:0.92rem;">
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Interface</span><br><strong>WhatsApp (whatsapp-web.js)</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Agent</span><br><strong>M3CHA Claw — LangGraph</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Backend</span><br><strong>FastAPI (Port 8001)</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Persistence</span><br><strong>Supabase (PostgreSQL)</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Pipeline Stages</span><br><strong>5 Kanban Stages</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Access</span><br><strong>Mobile-First, No App Required</strong></div>
                </div>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    M3CHA Claw is a persistent WhatsApp-connected agent built on <strong>whatsapp-web.js</strong> and bridged directly to the M3CHA backend. Each incoming message is routed through the <strong>LangGraph semantic router</strong>, which identifies intent — whether it's a status query, a stage update, a bid briefing request, or a deadline alert — and executes the appropriate tool against the live database.
                </p>

                <p style="font-size:0.97rem; opacity:0.85;">
                    This module represents the <strong>zero-friction field operations layer</strong> of the M3CHA OS — allowing BD officers on-site at client locations or government agencies to manage the entire procurement pipeline through a chat they already have open, without switching context or carrying a laptop.
                </p>
            </div>
        `,
        repo: "#"
    },
    "M3CHA Decision": {
        images: ["images/m6.png"],
        longDesc: `
            <div style="line-height:1.8;">
                <p style="font-size:1.1rem; margin-bottom:1.75rem; opacity:0.9;">
                    M3CHA Decision is the <strong>adversarial reasoning engine</strong> of the Power4All Agentic OS — a Model Debate system where two frontier LLMs compete in parallel on the same query, and a third Judge AI selects the winner. Rather than trusting a single model's output for high-stakes decisions, M3CHA Decision forces <strong>structured disagreement</strong> to surface the most accurate, actionable answer.
                </p>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    When a strategic question is routed to M3CHA Decision — bid qualifications, market analysis, risk assessments, proposal strategies — <strong>Gemini 2.5 Flash</strong> and <strong>GPT-4.1</strong> are fired simultaneously in an async pipeline. Both models receive the identical query and generate independent responses with no knowledge of the other's output.
                </p>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem 2rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.25rem 1.5rem; margin-bottom:1.75rem; font-size:0.92rem;">
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Debater A</span><br><strong>Gemini 2.5 Flash</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Debater B</span><br><strong>GPT-4.1</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Judge</span><br><strong>GPT-4.1-mini</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Execution</span><br><strong>Fully Async (Parallel)</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Triggers On</span><br><strong>Strategic / Complex Queries</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Output</span><br><strong>Scored JSON — Winner + Reason</strong></div>
                </div>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    The <strong>Judge AI (GPT-4.1-mini)</strong> then evaluates both responses across four dimensions: <em>Accuracy, Depth, Actionability, and Clarity</em> — returning a structured JSON verdict with individual scores (1–10), the winning model, and a concise reason. The winning answer is delivered to the user as the final response, with the debate metadata preserved for transparency.
                </p>

                <p style="font-size:0.97rem; opacity:0.85;">
                    This architecture eliminates single-model blind spots for critical enterprise decisions — transforming AI from a single opinionated source into a <strong>competitive intelligence tribunal</strong> where the best reasoning wins, not the first.
                </p>
            </div>
        `,
        repo: "#"
    },
    "M3CHA Sales Cycle Forecasts": {
        images: ["images/m7.png"],
        longDesc: `
            <div style="line-height:1.8;">
                <p style="font-size:1.1rem; margin-bottom:1.75rem; opacity:0.9;">
                    M3CHA Sales Cycle Forecasts is an <strong>Annual Procurement Plan (APP) extraction engine</strong> that pipelines visual intelligence into pipeline strategy. It autonomously scans complex, unstructured government procurement tables and images to predict upcoming projects long before they hit the live bidding portals.
                </p>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    The system employs a rigorous two-stage extraction architecture. In Stage 1, it utilizes <strong>Gemini 2.5 Flash Vision</strong> to perform zero-shot OCR on scanned procurement documents, isolating critical metadata: agency names, target quarters, categories, and approved budgets. If the primary model struggles with complex table structures and returns unstructured text, the pipeline dynamically falls back to Stage 2.
                </p>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem 2rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.25rem 1.5rem; margin-bottom:1.75rem; font-size:0.92rem;">
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Stage 1 OCR</span><br><strong>Gemini 2.5 Flash Vision</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Stage 2 Fallback</span><br><strong>Qwen 3.5 397B Cloud</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Extraction</span><br><strong>Budgets, Agencies, Quarters</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Inference Router</span><br><strong>Ollama (Local/Cloud)</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Categorization</span><br><strong>Water, Solar, STP, Solid Waste</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Persistence</span><br><strong>SQLite (Forecast Database)</strong></div>
                </div>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    Stage 2 leverages <strong>Qwen 3.5 397B Cloud</strong> via Ollama APIs as a heavy-duty data structurer. It takes the raw OCR text and forcefully coerces it into a strictly validated JSON schema. This ensures that even the lowest-quality government scans are converted into actionable, structured data.
                </p>

                <p style="font-size:0.97rem; opacity:0.85;">
                    By indexing these forecasts into the central <strong>SQLite database</strong>, the BD team gains a massive strategic advantage. Instead of waiting for a PhilGEPS listing to appear alongside competitors, Power4All can forecast agency spending patterns, anticipate project releases by quarter (Q1-Q4), and engage decision-makers months in advance.
                </p>
            </div>
        `,
        repo: "#"
    },
    "M3CHA Signal Intelligence": {
        images: ["images/m8.png"],
        longDesc: `
            <div style="line-height:1.8;">
                <p style="font-size:1.1rem; margin-bottom:1.75rem; opacity:0.9;">
                    M3CHA Signal Intelligence (SIGINT) is the <strong>real-time market awareness layer</strong> of the Power4All Agentic OS — an OSINT-grade intelligence feed engine that continuously monitors six business-critical channels using <strong>Perplexity Sonar Pro's grounded web search</strong>, delivering structured news briefings with live citations to the command center dashboard every 30 minutes.
                </p>

                <p style="font-size:0.97rem; margin-bottom:1.25rem; opacity:0.85;">
                    Each intelligence channel runs a precision-crafted query against the live web, returning <strong>15–20 structured news items</strong> per cycle — each with headline, 2–3 sentence summary, source publication, URL, publication time, and a category tag (BREAKING / UPDATE / ANALYSIS / REPORT). All results are cached locally and served via FastAPI with zero latency on subsequent reads.
                </p>

                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.5rem; margin-bottom:1.75rem; font-size:0.88rem;">
                    <div style="background:rgba(139,92,246,0.1); border:1px solid rgba(139,92,246,0.25); border-radius:8px; padding:0.75rem 1rem;">
                        <div style="opacity:0.6; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Channel 1</div>
                        <strong>AI &amp; Technology</strong>
                    </div>
                    <div style="background:rgba(6,182,212,0.1); border:1px solid rgba(6,182,212,0.25); border-radius:8px; padding:0.75rem 1rem;">
                        <div style="opacity:0.6; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Channel 2</div>
                        <strong>Water Infrastructure</strong>
                    </div>
                    <div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.25); border-radius:8px; padding:0.75rem 1rem;">
                        <div style="opacity:0.6; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Channel 3</div>
                        <strong>Solar &amp; Energy</strong>
                    </div>
                    <div style="background:rgba(59,130,246,0.1); border:1px solid rgba(59,130,246,0.25); border-radius:8px; padding:0.75rem 1rem;">
                        <div style="opacity:0.6; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Channel 4</div>
                        <strong>Business Development</strong>
                    </div>
                    <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25); border-radius:8px; padding:0.75rem 1rem;">
                        <div style="opacity:0.6; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Channel 5</div>
                        <strong>Local PH News</strong>
                    </div>
                    <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); border-radius:8px; padding:0.75rem 1rem;">
                        <div style="opacity:0.6; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">Channel 6</div>
                        <strong>Global Intel</strong>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem 2rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.25rem 1.5rem; margin-bottom:1.75rem; font-size:0.92rem;">
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Intelligence Source</span><br><strong>Perplexity Sonar Pro</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Cache TTL</span><br><strong>30 Minutes</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Items per Cycle</span><br><strong>15–20 per Channel</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Output Format</span><br><strong>Structured JSON + Citations</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Coverage Window</span><br><strong>Last 24–48 Hours</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Tags</span><br><strong>BREAKING / UPDATE / ANALYSIS / REPORT</strong></div>
                </div>

                <p style="font-size:0.97rem; opacity:0.85;">
                    By integrating SIGINT directly into the command center, M3CHA ensures that every strategic decision — whether a bid qualification, a proposal, or a Go/No-Go call — is made with <strong>live market context</strong>. The BD team is never operating on stale intelligence; the system surfaces relevant shifts in policy, competitor activity, and sector developments before the competition even notices them.
                </p>
            </div>
        `,
        repo: "#"
    },
    "M3CHA Customer Database": {
        images: ["images/m9.png"],
        longDesc: `
            <div style="line-height:1.8;">
                <p style="font-size:1.1rem; margin-bottom:1.75rem; opacity:0.9;">
                    M3CHA Customer Database is the <strong>Target Intelligence &amp; Influence Mapping Engine</strong> of the Power4All Agentic OS — an autonomous CRM layer that does far more than store contact details. It actively uses <strong>Perplexity Sonar Pro</strong> to scrape the web, build live organizational charts of target agencies, and map the key decision-makers who influence procurement outcomes.
                </p>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    When a new high-value target is identified (e.g., a regional water district or enterprise corporate account), the engine runs an OSINT scan to identify the leadership team, technical working group members, and procurement officers. It tracks Power4All's contact history with each individual, instantly exposing <strong>relationship gaps</strong> where the BD team lacks penetration.
                </p>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem 2rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.25rem 1.5rem; margin-bottom:1.75rem; font-size:0.92rem;">
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Intelligence Source</span><br><strong>Perplexity Sonar Pro</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Data Structure</span><br><strong>Hierarchical Org Charts</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Key Metric</span><br><strong>Influence &amp; Relationship Mapping</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Storage Layer</span><br><strong>Local JSON Store</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Integration</span><br><strong>M3CHA Sales Forecasts</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Agent Access</span><br><strong>LangGraph OSINT Tools</strong></div>
                </div>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    The intelligence gathered by this module feeds directly into the <strong>M3CHA Sales Cycle Forecasts</strong> system. By analyzing the depth of established relationships against the identified organizational chart, the system calculates a more accurate win probability for upcoming bids — penalizing forecasts where the true decision-makers have not been engaged.
                </p>

                <p style="font-size:0.97rem; opacity:0.85;">
                    This architecture shifts the BD team's strategy from reactive bidding to <strong>proactive account penetration</strong> — ensuring that when a tender is finally published, Power4All already understands the organizational dynamics, has influenced the technical requirements, and holds the relationship leverage needed to win.
                </p>
            </div>
        `,
        repo: "#"
    },
    "Agentic Tender Intelligence System": {
        images: ["images/ai-tender-intelligence-workflow.png"],
        longDesc: `
            <div style="font-family: var(--font-family-sans); color: var(--color-text-secondary); line-height: 1.6;">
                <p style="margin-bottom: 1.5rem; font-size: 1.1rem; color: var(--color-text);">
                    The <strong>Agentic Tender Intelligence System (ATIS)</strong> is an advanced AI orchestration workflow built on <strong>n8n</strong>. It automates the discovery, evaluation, and qualification of government procurement opportunities from the PhilGEPS Open Data portal.
                </p>
                <div style="display: grid; gap: 1.5rem; margin-bottom: 1.5rem;">
                    <div style="background: rgba(255,255,255,0.05); padding: 1.25rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                        <h4 style="color: var(--accent); margin-bottom: 0.5rem; font-size: 1rem;">Multi-Agent Orchestration</h4>
                        <p style="font-size: 0.95rem;">Utilizes a <strong>Supervisor Pattern</strong> overriding single LLM prompts. A GPT-4o <strong>Technical Evaluator Agent</strong> scans for precise engineering keywords (e.g., Grid-tied solar), while a <strong>Budget Analyzer Agent</strong> estimates financial viability via ABC limits.</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 1.25rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                        <h4 style="color: var(--accent); margin-bottom: 0.5rem; font-size: 1rem;">RAG-Enhanced Memory</h4>
                        <p style="font-size: 0.95rem;">Indexes massive historical tensor data via a <strong>Vector Store</strong>. The orchestrator cross-references past agency behavior to estimate the numerical <strong>Win Probability</strong> for highly competitive opportunities.</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 1.25rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                        <h4 style="color: var(--accent); margin-bottom: 0.5rem; font-size: 1rem;">Structured Lead Scoring</h4>
                        <p style="font-size: 0.95rem;">Every processed lead generates a strict JSON schema via advanced parsing, determining a composite <strong>Priority Score (0-100)</strong>, categorizing leads (Critical to Low), and issuing urgent Gmail or database notifications if boundaries are exceeded.</p>
                    </div>
                </div>
            </div>
        `,
        repo: "#"
    },
    "Water Treatment Plant Digital Twin": {
        images: ["images/digitalthumb.png", "images/digital1.png", "images/digital2.png", "images/digital3.png", "images/digital4.png", "images/digital5.png", "images/digital6.png", "images/digital7.png", "images/digital8.png", "images/digital9.png", "images/digital10.png"],
        longDesc: `
            <div style="line-height:1.8;">
                <p style="font-size:1.1rem; margin-bottom:1.75rem; opacity:0.9;">
                    The <strong>Water Treatment Plant Digital Twin</strong> is a high-performance, browser-based industrial simulator built to bridge the IT/OT gap. Designed as a training and diagnostic platform, it renders mission-critical water infrastructure with sub-millimeter precision using <strong>Three.js (WebGL)</strong>, running entirely in the browser without requiring native CAD software installations.
                </p>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    Beyond simple visualization, the core physics engine leverages <strong>Functional Mock-up Units (FMUs)</strong> to simulate complex fluid dynamics, pressure differentials, and real-time power consumption metrics across the facility. These physical models are continuously updated via a live <strong>MQTT IoT telemetry link</strong>, ensuring the digital asset state is a 1:1 replica of the physical plant.
                </p>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem 2rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:1.25rem 1.5rem; margin-bottom:1.75rem; font-size:0.92rem;">
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">3D Engine</span><br><strong>Three.js / WebGL / Vite</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Telemetry Protocol</span><br><strong>MQTT 5.0 Edge Link</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Physics Simulation</span><br><strong>Functional Mock-up Units (FMU)</strong></div>
                    <div style="padding:0.4rem 0; border-bottom:1px solid rgba(255,255,255,0.06);"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Predictive AI</span><br><strong>Reduced Order Models (ROM)</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">User Interface</span><br><strong>TypeScript / Vanilla CSS</strong></div>
                    <div style="padding:0.4rem 0;"><span style="opacity:0.45; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.05em;">Interactivity</span><br><strong>Disassembly Workshops &amp; Raycasting</strong></div>
                </div>

                <p style="font-size:0.97rem; margin-bottom:1.5rem; opacity:0.85;">
                    To enable proactive maintenance, the twin integrates an edge-based <strong>Machine Learning Inference Pipeline via Reduced Order Models (ROMs)</strong>. By computing heavy simulations directly in the client, the system predicts anomalous behaviors and impending equipment failures (e.g., pump cavitation, valve wear) without relying on expensive cloud compute.
                </p>

                <p style="font-size:0.97rem; opacity:0.85;">
                    The interface includes interactive disassembly workshops, real-time alerting overlay systems, and isolated component tuning (adjusting friction coefficients and wear factors)—providing plant operators and engineers with unparalleled oversight into the facility's lifecycle.
                </p>
            </div>
        `,
        repo: "#"
    },
    "PowerTwin Project": {
        images: ["images/PowerTwin.png", "images/PowerTwin-2.png", "images/PowerTwin-3.png", "images/PowerTwin-4.png", "images/PowerTwin-5.png"],
        longDesc: "PowerTwin is an advanced Digital Twin ecosystem designed to simulate physical assets in real-time. It leverages predictive AI algorithms to forecast maintenance needs, simulate dynamic system conditions to avoid catastrophic failures, and integrates a specialized diagnostic chatbot. This architecture guarantees a zero-downtime operational environment for mission-critical industrial infrastructure.",
        repo: "https://github.com/gryphlee/powertwin-project"
    },
    "Intelligent CNC Milling Lab": {
        images: ["images/cnc1.png", "images/cnc2.png"],
        longDesc: "Real-time digital simulation of a CNC machine featuring live G-Code tracking, dynamic tool position monitoring, and integrated AI vibration warnings. This system bridges the IT/OT gap by predicting anomalous behaviors.",
        repo: "#"
    },
    "Philippine Seismic Intelligence": {
        images: ["images/ph1.png", "images/ph2.png", "images/ph3.png", "images/ph4.png", "images/ph5.png"],
        longDesc: "The Philippine Seismic Intelligence platform is an elite predictive modeling dashboard. Utilizing historical data and live telemetry, it predicts seismic hazard probabilities across the volatile Philippine archipelago. It features interactive geographical heatmaps, temporal sequence mapping, and real-time hazard classification using advanced Machine Learning frameworks.",
        repo: "https://github.com/gryphlee/Philippine-Earthquake-Intelligence-Platform"
    },
    "LORA-Prime: Active C2 Dashboard": {
        images: ["images/project-lora-prime.png"],
        longDesc: "AI-Native General Staff (Prototype v8 - 'Action Handoff') dashboard for tactical operations. Features live adversarial threat modeling across geospatial quadrants and proactive Command & Control handoffs for rapid response teams.",
        repo: "#"
    },
    "Quantum Bio-Digital Simulator": {
        images: ["images/quantum1.jpg", "images/quantum2.jpg", "images/quantum3.jpg", "images/quantum4.jpg", "images/quantum5.jpg", "images/quantum6.jpg"],
        longDesc: "An advanced, interactive platform designed to model human physiology and test hypothetical medical interventions. It uses AI (RandomForestRegressor) to predict physiological responses like glucose levels and side-effects. Includes a conceptual Quantum Computing module demonstrating the future of computational molecule bonding analysis and drug formulation visualization.",
        repo: "https://github.com/gryphlee/Quantum-Bio-Digital-Simulator"
    },
    "Quantum Earth Digital Twin v2.3": {
        images: ["images/quant1.jpeg"],
        longDesc: "An integrated simulation suite for predictive climate analytics, quantum optimization, and AI scenario generation. Features an interactive 3D globe powered by Three.js with deep integration of classical Scikit-Learn models and a genuine quantum circuit simulation via IBM Qiskit.",
        repo: "https://github.com/gryphlee/Quantum-Earth-Digital-Twin"
    },
    "AI Student Intervention System": {
        images: ["images/int-orig.jpeg", "images/int1.jpeg", "images/int2.jpeg", "images/int3.jpeg", "images/int4.jpeg", "images/int5.jpeg", "images/int7.jpeg", "images/int8.jpeg", "images/int9.jpeg", "images/int10.jpeg", "images/int11.jpeg", "images/int12.jpeg", "images/int13.jpeg", "images/int14.jpeg", "images/int15.jpeg", "images/int16.jpeg", "images/int17.jpeg", "images/int18.jpeg", "images/int19.jpeg"],
        longDesc: "Dynamic AI risk predictor analyzing student performance metrics to forecast at-risk behaviors and plan automated interventions. A comprehensive Machine Learning dashboard enabling educators to intuitively track, predict, and systematically mitigate drop-out probabilities with precision.",
        repo: "https://github.com/gryphlee/student-predictor-streamlit-legacy"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-modal');
    if(!modal) return;
    
    const modalCloseBtn = document.getElementById('modal-close');
const modalMainContainer = document.getElementById('modal-main-container');
const modalThumbnails = document.getElementById('modal-thumbnails');
const modalTitle = document.getElementById('modal-title');
const modalTags = document.getElementById('modal-tags');
const modalDescLong = document.getElementById('modal-desc-long');
const modalLink = document.getElementById('modal-link');

const closeModal = () => modal.classList.add('hidden');
modalCloseBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeModal();
});

function renderMedia(src, container, isThumb = false) {
    container.innerHTML = '';
    let el;
    if(src.endsWith('.mp4') || src.endsWith('.webm')) {
        el = document.createElement('video');
        el.src = src;
        el.muted = true;
        el.loop = true;
        el.playsInline = true;
        if(isThumb) {
            // we can let thumbs static or play on hover, but autoplay logic required
            el.addEventListener('mouseenter', () => el.play().catch(e=>e));
            el.addEventListener('mouseleave', () => el.pause());
        } else {
            el.autoplay = true;
            el.play().catch(e=>e);
        }
    } else {
        el = document.createElement('img');
        el.src = src;
        el.alt = "Project Media";
    }
    container.appendChild(el);
}

document.querySelectorAll('.project-card .modal-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        const title = card.querySelector('.project-title').textContent;
        const tags = Array.from(card.querySelectorAll('.project-stack li')).map(li => li.textContent);
        
        let data = projectDatabase[title];
        if(!data) {
            // Fallback
            let img = card.querySelector('.project-image');
            let src = img.tagName === 'VIDEO' ? img.querySelector('source') ? img.querySelector('source').src : img.src : img.src;
            data = {
                images: [src],
                longDesc: card.querySelector('.project-description').textContent,
                repo: card.querySelector('.repo-link')?.href || '#'
            };
        }

        // Populate Modal
        modalTitle.textContent = title;
        modalDescLong.innerHTML = data.longDesc;
        modalLink.href = data.repo;
        
        // Populate Tags
        modalTags.innerHTML = tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('');

        // Populate Images
        const firstImg = data.images.find(src => !src.endsWith('.mp4') && !src.endsWith('.webm')) || data.images[0];
        renderMedia(firstImg, modalMainContainer, false);
        modalThumbnails.innerHTML = '';
        
        if(data.images.length > 1) {
            data.images.forEach((src, idx) => {
                const thumbWrap = document.createElement('div');
                renderMedia(src, thumbWrap, true);
                const thumb = thumbWrap.firstChild; // the video or img
                
                if(src === firstImg) thumb.classList.add('active');
                
                if(!src.endsWith('.mp4') && !src.endsWith('.webm')) {
                    thumb.addEventListener('click', () => {
                        renderMedia(src, modalMainContainer, false);
                        modalThumbnails.querySelectorAll('video, img').forEach(i => i.classList.remove('active'));
                        thumb.classList.add('active');
                    });
                } else {
                    // It's a video thumbnail, give it a visual cue it's just for preview
                    thumb.style.cursor = 'default';
                }
                modalThumbnails.appendChild(thumb);
            });
        }

        modal.classList.remove('hidden');
    });
});

});

// Architecture Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const archModal = document.getElementById('archModal');
    const closeArchModal = document.getElementById('closeArchModal');
    const archIframe = document.getElementById('archIframe');
    
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.arch-preview-btn');
        if (btn) {
            e.preventDefault();
            const src = btn.getAttribute('data-src');
            if (archIframe) { archIframe.src = src; }
            if (archModal) { 
                archModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    });

    if (closeArchModal && archModal) {
        closeArchModal.addEventListener('click', () => {
            archModal.classList.remove('active');
            setTimeout(() => { if (archIframe) archIframe.src = ''; }, 300);
            document.body.style.overflow = '';
        });
    }
});
