/**
 * Happy Rakshabandhan Surprise Gift Landing Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const giftBoxWrapper = document.getElementById('gift-box-wrapper');
    const ctaHint = document.getElementById('cta-hint');
    const surpriseCardContainer = document.getElementById('surprise-card-container');
    const copyBtn = document.getElementById('copy-btn');
    const copyText = document.getElementById('copy-text');
    const replayBtn = document.getElementById('replay-btn');
    const targetUrl = document.getElementById('target-url');

    let isOpened = false;

    // Initialize background sparkle particle system
    initSparkleCanvas();

    // Gift Box Click Event
    giftBoxWrapper.addEventListener('click', openSurprise);

    // Keyboard support for accessibility
    giftBoxWrapper.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openSurprise();
        }
    });

    // Also clicking CTA hint triggers open
    ctaHint.addEventListener('click', openSurprise);

    // Open Surprise Function
    function openSurprise() {
        if (isOpened) return;
        isOpened = true;

        // Hide hint
        ctaHint.classList.add('hidden');

        // Animate gift box opening
        giftBoxWrapper.classList.add('opened');

        // Trigger explosive confetti burst
        triggerConfetti();

        // Reveal card after lid opens
        setTimeout(() => {
            surpriseCardContainer.classList.add('active');
            
            // Secondary celebratory burst around the card
            setTimeout(() => {
                triggerSecondaryConfetti();
            }, 400);
        }, 450);
    }

    // Replay / Re-wrap Gift Box
    replayBtn.addEventListener('click', () => {
        surpriseCardContainer.classList.remove('active');

        setTimeout(() => {
            giftBoxWrapper.classList.remove('opened');
            ctaHint.classList.remove('hidden');
            isOpened = false;
        }, 400);
    });

    // Copy URL to Clipboard
    copyBtn.addEventListener('click', () => {
        const textToCopy = targetUrl.textContent.trim();
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.classList.add('copied');
            copyText.textContent = 'Copied! ✨';

            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyText.textContent = 'Copy Link';
            }, 2500);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            copyBtn.classList.add('copied');
            copyText.textContent = 'Copied! ✨';
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyText.textContent = 'Copy Link';
            }, 2500);
        });
    });

    // Confetti Fireworks Implementation
    function triggerConfetti() {
        if (typeof confetti === 'function') {
            // Main burst from center gift
            confetti({
                particleCount: 120,
                spread: 90,
                origin: { y: 0.6 },
                colors: ['#f7ca65', '#e69d27', '#9e1b38', '#ffffff', '#ff4d6d', '#ffd700'],
                scalar: 1.2
            });

            // Golden stars explosion
            confetti({
                particleCount: 40,
                spread: 120,
                origin: { y: 0.58 },
                colors: ['#ffe79a', '#ffd700', '#ffffff'],
                shapes: ['star'],
                scalar: 1.5
            });
        }
    }

    function triggerSecondaryConfetti() {
        if (typeof confetti === 'function') {
            // Side cannon bursts for rich feel
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0.1, y: 0.7 },
                colors: ['#f7ca65', '#9e1b38', '#ffd700']
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 0.9, y: 0.7 },
                colors: ['#f7ca65', '#9e1b38', '#ffd700']
            });
        }
    }

    // Ambient Sparkle Background System
    function initSparkleCanvas() {
        const canvas = document.getElementById('sparkle-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = 45;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2.5 + 0.5,
                speedY: Math.random() * -0.5 - 0.1,
                speedX: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.7 + 0.2,
                pulse: Math.random() * 0.02 + 0.005,
                color: Math.random() > 0.3 ? '#f7ca65' : '#ffffff'
            });
        }

        function renderSparkles() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.opacity += Math.sin(Date.now() * p.pulse) * 0.01;

                if (p.y < 0) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }

                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0.1, Math.min(0.9, p.opacity));
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.restore();
            });

            requestAnimationFrame(renderSparkles);
        }

        renderSparkles();
    }
});
