// ── Lightweight Particle System ──
// Max 120 particles, cursor-reactive, canvas-based
(function(){
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) { canvas.style.display = 'none'; return; }

    let W, H, particles = [], mouse = { x: -9999, y: -9999 };
    const MAX = 100, COLORS = ['rgba(0,245,212,', 'rgba(167,139,250,', 'rgba(255,255,255,'];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    class Particle {
        constructor(x, y, burst) {
            this.x = x || Math.random() * W;
            this.y = y || Math.random() * H;
            this.r = Math.random() * 1.8 + 0.4;
            this.vx = (Math.random() - 0.5) * (burst ? 3 : 0.15);
            this.vy = (Math.random() - 0.5) * (burst ? 3 : 0.15);
            this.alpha = Math.random() * 0.5 + 0.2;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.life = burst ? 80 + Math.random() * 40 : Infinity;
            this.age = 0;
            this.burst = burst || false;
        }
        update() {
            // Cursor repulsion
            const dx = this.x - mouse.x, dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120 && dist > 0) {
                const force = (120 - dist) / 120 * 0.8;
                this.vx += (dx / dist) * force;
                this.vy += (dy / dist) * force;
            }
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.x += this.vx;
            this.y += this.vy;
            this.age++;
            if (this.burst) {
                this.alpha = Math.max(0, this.alpha - 0.006);
                this.r *= 0.995;
            }
            // Wrap
            if (this.x < -10) this.x = W + 10;
            if (this.x > W + 10) this.x = -10;
            if (this.y < -10) this.y = H + 10;
            if (this.y > H + 10) this.y = -10;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.fill();
        }
        isDead() { return this.burst && this.age > this.life; }
    }

    // Init ambient particles
    for (let i = 0; i < MAX; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, W, H);
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].isDead()) particles.splice(i, 1);
        }
        requestAnimationFrame(animate);
    }
    animate();

    // Public burst function for form submit
    window.particleBurst = function(x, y) {
        const count = 30;
        for (let i = 0; i < count; i++) {
            if (particles.length < MAX + count) {
                particles.push(new Particle(x, y, true));
            }
        }
    };
})();
