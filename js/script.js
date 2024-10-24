document.addEventListener('DOMContentLoaded', function() {
    // Inicializar partículas
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });

    //Animación de habilidades
    const skillCards = document.querySelectorAll('.skill-card');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillProgress = entry.target.querySelector('.skill-progress');
                skillProgress.style.width = skillProgress.dataset.progress;
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillCards.forEach(card => {
        skillObserver.observe(card);
    });

    // Animación de proyectos
    const projectCards = document.querySelectorAll('.project-card');
    const projectObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    projectCards.forEach(card => {
        projectObserver.observe(card);
    });

    // Cursor personalizado
    const cursor = document.getElementById('cursor');
    const cursorBlur = document.getElementById('cursor-blur');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorBlur.style.left = e.clientX - 200 + 'px';
        cursorBlur.style.top = e.clientY - 200 + 'px';
    });


    // Animación de scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animación del logo
    function initLogoAnimation() {
        const logo = document.querySelector('.logo svg');
        let isAnimating = false;
        let animationFrame;
        const duration = 3000; // Animation duration in milliseconds
    
        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
    
        function animateLogo(timestamp) {
            if (!isAnimating) return;
    
            const progress = (timestamp % duration) / duration;
            const easeProgress = easeInOutCubic(progress);
    
            // Rotation animation
            const rotation = Math.sin(easeProgress * Math.PI * 2) * 15;
    
            // Scale animation
            const scale = 1 + Math.sin(easeProgress * Math.PI * 4) * 0.05;
    
            // Color transition
            const hue = 200 + Math.sin(easeProgress * Math.PI * 2) * 30;
    
            logo.style.transform = `rotate(${rotation}deg) scale(${scale})`;
            logo.style.fill = `hsl(${hue}, 70%, 50%)`;
    
            animationFrame = requestAnimationFrame(animateLogo);
        }
    
        function startAnimation() {
            if (!isAnimating) {
                isAnimating = true;
                logo.style.transition = 'none'; // Disable transition for smooth animation
                animationFrame = requestAnimationFrame(animateLogo);
            }
        }
    
        function stopAnimation() {
            isAnimating = false;
            cancelAnimationFrame(animationFrame);
            logo.style.transition = 'transform 0.3s ease-out, fill 0.3s ease-out';
            logo.style.transform = 'rotate(0deg) scale(1)';
            logo.style.fill = ''; // Reset to original color
        }
    
        // Mouse events
        logo.addEventListener('mouseenter', startAnimation);
        logo.addEventListener('mouseleave', stopAnimation);
    
        // Touch events for mobile devices
        logo.addEventListener('touchstart', startAnimation);
        logo.addEventListener('touchend', stopAnimation);
    
        // Keyboard events for accessibility
        logo.tabIndex = 0; // Make the logo focusable
        logo.addEventListener('focus', startAnimation);
        logo.addEventListener('blur', stopAnimation);
    
        // Add aria-label for screen readers
        logo.setAttribute('aria-label', 'Animated logo');
    
        // Pause animation when page is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAnimation();
            } else if (logo.matches(':hover')) {
                startAnimation();
            }
        });
    }

    // Animación de entrada para secciones
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1
            }
        });
    });

    // Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('#navbar ul');
    const body = document.body;

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        navUl.classList.toggle('active');
        body.classList.toggle('menu-open');

        // Toggle aria-expanded
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);

        // Set max-height for animation
        if (navUl.classList.contains('active')) {
            navUl.style.maxHeight = `${navUl.scrollHeight}px`;
        } else {
            navUl.style.maxHeight = '0px';
        }
    }

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('#navbar ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                toggleMenu();
                setTimeout(() => {
                    window.location.href = link.href;
                }, 300);
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (
            navUl.classList.contains('active') && 
            !navUl.contains(e.target) && 
            !menuToggle.contains(e.target)
        ) {
            toggleMenu();
        }
    });

    // Handle resize events
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            menuToggle.classList.remove('active');
            navUl.classList.remove('active');
            body.classList.remove('menu-open');
            navUl.style.maxHeight = '';
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Accessibility
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Toggle menu');
});