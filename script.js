document.addEventListener('DOMContentLoaded', () => {
    
    // --- Canvas Particles (Sparks) ---
    const canvas = document.getElementById('sparks-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = document.getElementById('hero').offsetHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = document.getElementById('hero').offsetHeight;
        });

        const particles = [];
        const numParticles = 80;

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 200;
                this.vx = (Math.random() - 0.5) * 1;
                this.vy = -Math.random() * 2 - 0.5;
                this.size = Math.random() * 2.5 + 0.5;
                this.opacity = Math.random() * 0.8 + 0.2;
                // Gold/Orange tones
                this.color = Math.random() > 0.5 ? `rgba(255, 179, 0, ${this.opacity})` : `rgba(255, 106, 0, ${this.opacity})`;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (Math.random() > 0.95) this.vx += (Math.random() - 0.5) * 0.5; // flutter
                if (this.y < -10) {
                    this.y = height + 10;
                    this.x = Math.random() * width;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        function animateSparks() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateSparks);
        }
        animateSparks();
    }

    // --- Scroll Animations (Intersection Observer) ---
    const revalElements = document.querySelectorAll('.reveal-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, observerOptions);
    
    revalElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Form Handling ---
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real app, this would send an AJAX request to a backend/CRM
            const btn = bookingForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Request Sent!';
            btn.style.background = 'linear-gradient(135deg, #00E5FF, #00B3FF)';
            btn.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.5)';
            
            setTimeout(() => {
                bookingForm.reset();
                btn.innerText = originalText;
                btn.style.background = '';
                btn.style.boxShadow = '';
            }, 3000);
        });
    }

    // --- Floating Chatbot Logic ---
    const chatToggleBtn = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chatbot-window');
    const chatCloseBtn = document.getElementById('chatbot-close');
    const optionsContainer = document.getElementById('chatbot-options');
    const messagesContainer = document.getElementById('chatbot-messages');
    
    let isChatOpen = false;

    // The Pre-determined Q&A Database
    const qaDatabase = [
        {
            q: "What services do you offer?",
            a: "We offer interior detailing, exterior detailing, bundled packages, and add-ons like carpet shampoo and pet hair removal to help keep your vehicle looking its best."
        },
        {
            q: "How much is a basic interior detail?",
            a: "Our Basic Interior Detail starts at $120 and includes vacuuming, dust and wipe down, dash/doors/center console cleaning, and windows."
        },
        {
            q: "How much is a basic exterior detail?",
            a: "Our Basic Exterior Detail starts at $80 and includes pre-wash, foam wash, hand dry, wheels and tires, and windows."
        },
        {
            q: "Do you charge more for SUVs or trucks?",
            a: "Yes — SUV and truck services have a +$20 upcharge."
        },
        {
            q: "Do you offer carpet shampoo?",
            a: "Yes — shampoo for carpets and rugs is available as an add-on for +$30."
        },
        {
            q: "Do you remove pet hair?",
            a: "Yes — pet hair removal is available as an add-on for +$35."
        },
        {
            q: "What package should I choose?",
            a: "If you want a simple refresh, start with Basic. If you want a stronger overall clean and better value, Gold is a great choice. If you want the most complete premium result, choose the Premium Package."
        },
        {
            q: "How do I book?",
            a: "You can book by using the website’s booking form or by calling us directly at (540) 771-7419."
        },
        {
            q: "Can I get both interior and exterior done?",
            a: "Yes — we offer bundled packages designed for customers who want both interior and exterior detailing."
        },
        {
            q: "How do I contact you?",
            a: "You can reach Next Level Detailing at (540) 771-7419."
        }
    ];

    function toggleChat() {
        isChatOpen = !isChatOpen;
        if (isChatOpen) {
            chatWindow.classList.remove('hidden');
            chatToggleBtn.style.transform = 'scale(0) opacity(0)';
            setTimeout(() => chatToggleBtn.style.display = 'none', 300);
            
            // Scroll chat to bottom if needed
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } else {
            chatWindow.classList.add('hidden');
            chatToggleBtn.style.display = 'flex';
            setTimeout(() => chatToggleBtn.style.transform = 'scale(1)', 10);
        }
    }

    chatToggleBtn.addEventListener('click', toggleChat);
    chatCloseBtn.addEventListener('click', toggleChat);

    // Initialize Chat Options
    function initChatOptions() {
        optionsContainer.innerHTML = '';
        qaDatabase.forEach((item, index) => {
            const chip = document.createElement('button');
            chip.className = 'chat-chip';
            chip.innerText = item.q;
            chip.addEventListener('click', () => handleChatOptionClick(item));
            optionsContainer.appendChild(chip);
        });
    }

    function addMessage(text, isBot = true) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isBot ? 'bot-message' : 'user-message'}`;
        msgDiv.innerText = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function handleChatOptionClick(item) {
        // Hide options briefly or permanently (we'll just append messages)
        addMessage(item.q, false);
        
        // Disable options during typing simulation
        const chips = document.querySelectorAll('.chat-chip');
        chips.forEach(chip => chip.style.pointerEvents = 'none');
        
        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerText = '...';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulate network/typing delay
        setTimeout(() => {
            typingDiv.remove();
            addMessage(item.a, true);
            
            // Re-enable options
            chips.forEach(chip => chip.style.pointerEvents = 'auto');
        }, 800);
    }

    initChatOptions();

    // --- Before/After Slider Logic ---
    const sliderContainer = document.getElementById('slider-container');
    const beforeImg = document.getElementById('before-img');
    const sliderHandle = document.getElementById('slider-handle');

    if (sliderContainer && beforeImg && sliderHandle) {
        let isDragging = false;
        
        const updateSlider = (e) => {
            if (!isDragging) return;
            const rect = sliderContainer.getBoundingClientRect();
            let x = 0;
            if (e.type && e.type.includes('touch')) {
                x = e.touches[0].clientX - rect.left;
            } else {
                x = e.clientX - rect.left;
            }
            let position = (x / rect.width) * 100;
            position = Math.max(0, Math.min(position, 100));
            
            beforeImg.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
            sliderHandle.style.left = `${position}%`;
        };

        sliderContainer.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', updateSlider);

        sliderContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSlider(e);
        }, {passive: true});
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('touchmove', updateSlider, {passive: true});
        
        // Initial Cinematic Reveal Animation
        setTimeout(() => {
            beforeImg.style.transition = 'clip-path 1.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
            sliderHandle.style.transition = 'left 1.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
            beforeImg.style.clipPath = 'polygon(0 0, 75% 0, 75% 100%, 0 100%)';
            sliderHandle.style.left = '75%';
            
            setTimeout(() => {
                beforeImg.style.transition = 'none';
                sliderHandle.style.transition = 'none';
            }, 1500);
        }, 800);
    }
});
