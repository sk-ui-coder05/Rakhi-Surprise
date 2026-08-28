/**
 * Happy Raksha Bandhan Surprise Gifts Logic (Didi & Shruti)
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Didi
    const giftBoxDidi = document.getElementById('gift-box-didi');
    const modalDidi = document.getElementById('modal-didi');

    // DOM Elements - Shruti
    const giftBoxShruti = document.getElementById('gift-box-shruti');
    const modalShruti = document.getElementById('modal-shruti');
    const copyBtnShruti = document.getElementById('copy-btn-shruti');
    const copyTextShruti = document.getElementById('copy-text-shruti');
    const targetUrlShruti = document.getElementById('target-url-shruti');

    // Audio Elements & Controls
    const bgMusic = document.getElementById('bg-music');
    const audioBtn = document.getElementById('audio-btn');
    const audioLabel = document.getElementById('audio-label');
    const musicIcon = document.getElementById('music-icon');

    let audioPlaying = false;
    bgMusic.volume = 0.55;

    // Attempt autoplay immediately
    attemptAutoplay();

    // Browser Autoplay Handler
    function attemptAutoplay() {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                audioPlaying = true;
                updateAudioUI(true);
            }).catch(error => {
                console.log('Browser blocked unmuted autoplay. Waiting for user interaction.');
                audioPlaying = false;
                updateAudioUI(false);
                
                // Play audio on first user gesture anywhere
                const enableAudioOnUserGesture = () => {
                    if (!audioPlaying) {
                        bgMusic.play().then(() => {
                            audioPlaying = true;
                            updateAudioUI(true);
                        }).catch(() => {});
                    }
                    window.removeEventListener('click', enableAudioOnUserGesture);
                    window.removeEventListener('keydown', enableAudioOnUserGesture);
                    window.removeEventListener('touchstart', enableAudioOnUserGesture);
                };

                window.addEventListener('click', enableAudioOnUserGesture);
                window.addEventListener('keydown', enableAudioOnUserGesture);
                window.addEventListener('touchstart', enableAudioOnUserGesture);
            });
        }
    }

    // Audio Toggle Button Click
    audioBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bgMusic.paused) {
            bgMusic.play();
            audioPlaying = true;
            updateAudioUI(true);
        } else {
            bgMusic.pause();
            audioPlaying = false;
            updateAudioUI(false);
        }
    });

    function updateAudioUI(isPlaying) {
        if (isPlaying) {
            audioLabel.textContent = 'Music On';
            musicIcon.textContent = '🎵';
        } else {
            audioLabel.textContent = 'Music Off';
            musicIcon.textContent = '🔇';
        }
    }

    // Web Audio API Festive Unboxing Sound Chime
    function playUnboxingChime() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();

            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

                gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(ctx.currentTime + idx * 0.08);
                osc.stop(ctx.currentTime + idx * 0.08 + 0.6);
            });
        } catch (e) {
            console.log('Web Audio Chime error:', e);
        }
    }

    // Open Didi's Gift
    giftBoxDidi.addEventListener('click', () => openGift('didi'));
    giftBoxDidi.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openGift('didi');
        }
    });

    // Open Shruti's Gift
    giftBoxShruti.addEventListener('click', () => openGift('shruti'));
    giftBoxShruti.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openGift('shruti');
        }
    });

    function openGift(recipient) {
        // Ensure background music is playing
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                audioPlaying = true;
                updateAudioUI(true);
            }).catch(() => {});
        }

        // Play unboxing SFX
        playUnboxingChime();

        if (recipient === 'didi') {
            giftBoxDidi.classList.add('opened');
            triggerConfetti(['#0b5e78', '#f5b318', '#ffd966', '#137796']);
            setTimeout(() => {
                modalDidi.classList.add('active');
            }, 420);
        } else {
            giftBoxShruti.classList.add('opened');
            triggerConfetti(['#b81424', '#ff9900', '#f5b318', '#ffd966']);
            setTimeout(() => {
                modalShruti.classList.add('active');
            }, 420);
        }
    }

    // Close Modals
    document.querySelectorAll('.close-modal-btn, .replay-didi-btn, .replay-shruti-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modalDidi.classList.remove('active');
            modalShruti.classList.remove('active');
            setTimeout(() => {
                giftBoxDidi.classList.remove('opened');
                giftBoxShruti.classList.remove('opened');
            }, 350);
        });
    });

    // Close on backdrop click
    [modalDidi, modalShruti].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    giftBoxDidi.classList.remove('opened');
                    giftBoxShruti.classList.remove('opened');
                }, 350);
            }
        });
    });

    // Copy Handlers
    function setupCopy(button, textSpan, textToCopy, defaultText) {
        if (!button || !textSpan) return;
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(textToCopy).then(() => {
                button.classList.add('copied');
                textSpan.textContent = 'Copied! ✨';

                setTimeout(() => {
                    button.classList.remove('copied');
                    textSpan.textContent = defaultText;
                }, 2500);
            }).catch(() => {
                // Fallback
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                button.classList.add('copied');
                textSpan.textContent = 'Copied! ✨';
                setTimeout(() => {
                    button.classList.remove('copied');
                    textSpan.textContent = defaultText;
                }, 2500);
            });
        });
    }

    setupCopy(copyBtnShruti, copyTextShruti, targetUrlShruti.textContent.trim(), 'Copy Voucher Link');

    // Confetti Fireworks Implementation
    function triggerConfetti(colorPalette) {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 110,
                spread: 90,
                origin: { y: 0.6 },
                colors: colorPalette || ['#0b5e78', '#f5b318', '#c40d1e', '#ffd966'],
                scalar: 1.2
            });

            confetti({
                particleCount: 35,
                spread: 120,
                origin: { y: 0.58 },
                colors: ['#fff5c0', '#f5b318', '#e09b0a'],
                shapes: ['star'],
                scalar: 1.4
            });
        }
    }

    // Ambient Sparkle Particle Background
    initSparkleCanvas();

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
        const particleCount = 30;
        const colors = ['#f5b318', '#e8896a', '#d48b00', '#e05a47', '#ffbe76'];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2 + 1.2,
                speedY: Math.random() * -0.3 - 0.08,
                speedX: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.4 + 0.2,
                pulse: Math.random() * 0.02 + 0.005,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        function renderSparkles() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.opacity += Math.sin(Date.now() * p.pulse) * 0.008;

                if (p.y < 0) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }

                ctx.save();
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = Math.max(0.15, Math.min(0.55, p.opacity));
                ctx.fill();
                ctx.restore();
            });

            requestAnimationFrame(renderSparkles);
        }

        renderSparkles();
    }
});
