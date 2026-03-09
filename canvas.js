export function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY + window.scrollY; // adjust for scroll if needed
    });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = document.documentElement.scrollHeight; // ensure canvas coverage
    }

    window.addEventListener('resize', resize);
    resize(); // initial size

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.baseY = this.y;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;

            // mouse interaction
            let dx = mouse.x - this.x;
            // Simple offset for scroll position mapping to canvas absolute position.
            // Easiest is to make canvas `fixed` but prompt asked for 'Hero Background'.
            // If canvas is absolute and spans whole document:
            let dy = mouse.y - this.y;

            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = forceDirectionX * force * 2;
                const directionY = forceDirectionY * force * 2;

                this.x -= directionX;
                this.y -= directionY;
            }
        }
        draw() {
            ctx.fillStyle = 'rgba(88, 157, 14, 0.4)'; // Vibrant Green #589d0e
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        let numberOfParticles = (width * window.innerHeight) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(88, 157, 14, ${0.12 - distance / 1000})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    // Re-init particles on resize to adjust density
    window.addEventListener('resize', () => {
        initParticles();
    });

    initParticles();
    animate();
}

export function initDustCanvas() {
    const canvas = document.getElementById('dustCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    let particles = [];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedY = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.alpha = Math.random() * 0.6 + 0.2;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;

            if (this.y > h) this.y = 0;
            if (this.y < 0) this.y = h;
            if (this.x > w) this.x = 0;
            if (this.x < 0) this.x = w;
        }
        draw() {
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = '#589d0e'; // Vibrant Green
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const particleCount = 120;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}
