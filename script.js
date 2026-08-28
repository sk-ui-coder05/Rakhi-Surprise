/**
 * Happy Raksha Bandhan Surprise Gift Landing Page Logic (Light Theme)
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const giftBoxWrapper = document.getElementById('gift-box-wrapper');
    const surpriseCardContainer = document.getElementById('surprise-card-container');
    const copyBtn = document.getElementById('copy-btn');
    const copyText = document.getElementById('copy-text');
    const replayBtn = document.getElementById('replay-btn');
    const closeCardBtn = document.getElementById('close-card-btn');
    const targetUrl = document.getElementById('target-url');

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
            audioBtn.classList.remove('muted');
            audioLabel.textContent = 'Music On';
            musicIcon.textContent = '🎵';
        } else {
            audioBtn.classList.add('muted');
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

    // Open Surprise Function
    function openSurprise() {
        if (isOpened) return;
        isOpened = true;

        // Ensure background music is playing
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                audioPlaying = true;
                updateAudioUI(true);
            }).catch(() => {});
        }

        // Play festive magical chime SFX
        playUnboxingChime();

        // Animate gift box opening
        giftBoxWrapper.classList.add('opened');

        // Trigger explosive confetti burst
        triggerConfetti();

        // Reveal card modal after lid opens
        setTimeout(() => {
            surpriseCardContainer.classList.add('active');
            
            // Secondary celebratory burst around the card
            setTimeout(() => {
                triggerSecondaryConfetti();
            }, 350);
        }, 450);
    }

    // Close / Replay Function
    function closeCardAndRewrap() {
        surpriseCardContainer.classList.remove('active');

        setTimeout(() => {
            giftBoxWrapper.classList.remove('opened');
            isOpened = false;
        }, 400);
    }

    // Close buttons
    if (replayBtn) replayBtn.addEventListener('click', closeCardAndRewrap);
    if (closeCardBtn) closeCardBtn.addEventListener('click', closeCardAndRewrap);

    // Close on clicking modal backdrop
    surpriseCardContainer.addEventListener('click', (e) => {
        if (e.target === surpriseCardContainer) {
            closeCardAndRewrap();
        }
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
            // Fallback
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

    // Confetti Fireworks Implementation (Matching Theme Colors: Teal, Ruby, Gold)
    function triggerConfetti() {
        if (typeof confetti === 'function') {
            // Main burst from center gift
            confetti({
                particleCount: 110,
                spread: 90,
                origin: { y: 0.6 },
                colors: ['#0e6884', '#f2b705', '#b81424', '#d48b00', '#168ba8'],
                scalar: 1.2
            });

            // Golden stars explosion
            confetti({
                particleCount: 35,
                spread: 120,
                origin: { y: 0.58 },
                colors: ['#fff5c0', '#f2b705', '#d48b00'],
                shapes: ['star'],
                scalar: 1.4
            });
        }
    }

    function triggerSecondaryConfetti() {
        if (typeof confetti === 'function') {
            // Side cannon bursts
            confetti({
                particleCount: 45,
                angle: 60,
                spread: 50,
                origin: { x: 0.15, y: 0.65 },
                colors: ['#0e6884', '#f2b705', '#b81424']
            });
            confetti({
                particleCount: 45,
                angle: 120,
                spread: 50,
                origin: { x: 0.85, y: 0.65 },
                colors: ['#0e6884', '#f2b705', '#b81424']
            });
        }
    }

    // Ambient Sparkle Background System (Light Warm Gold Glitter)
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
        const particleCount = 35;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2.2 + 0.8,
                speedY: Math.random() * -0.4 - 0.1,
                speedX: (Math.random() - 0.5) * 0.25,
                opacity: Math.random() * 0.5 + 0.2,
                pulse: Math.random() * 0.02 + 0.005,
                color: Math.random() > 0.4 ? '#d48b00' : '#0e6884'
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
                ctx.globalAlpha = Math.max(0.1, Math.min(0.65, p.opacity));
                ctx.shadowBlur = 6;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.restore();
            });

            requestAnimationFrame(renderSparkles);
        }

        renderSparkles();
    }
});
