document.addEventListener('DOMContentLoaded', () => {
    // ═══════════════════════════════════════════════════════════
    // 1. Theme & RTL Initialization
    // ═══════════════════════════════════════════════════════════
    const currentTheme = localStorage.getItem('theme') || 'light';
    const currentDir = localStorage.getItem('dir') || 'ltr';

    document.documentElement.setAttribute('data-theme', currentTheme);
    document.documentElement.setAttribute('dir', currentDir);

    // 2. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            // Update icon
            const icon = themeBtn.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }
        });
        // Set initial icon
        const icon = themeBtn.querySelector('i');
        if (icon) {
            icon.className = currentTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }

    // 3. RTL Toggle Logic
    const dirBtn = document.getElementById('dir-toggle');
    if (dirBtn) {
        dirBtn.addEventListener('click', () => {
            const dir = document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.setAttribute('dir', dir);
            localStorage.setItem('dir', dir);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // 4. Mobile Navigation Toggle
    // ═══════════════════════════════════════════════════════════
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.className = navLinks.classList.contains('active')
                    ? 'fa-solid fa-xmark'
                    : 'fa-solid fa-bars';
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bars';
        }
    });

    // ═══════════════════════════════════════════════════════════
    // 5. Smooth Scrolling for Anchor Links
    // ═══════════════════════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = navToggle.querySelector('i');
                    if (icon) icon.className = 'fa-solid fa-bars';
                }
            }
        });
    });

    // ═══════════════════════════════════════════════════════════
    // 6. Scroll-Triggered Animations (Intersection Observer)
    // ═══════════════════════════════════════════════════════════
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ═══════════════════════════════════════════════════════════
    // 7. Animated Number Counters
    // ═══════════════════════════════════════════════════════════
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = el.getAttribute('data-count');
                    const prefix = el.getAttribute('data-prefix') || '';
                    const suffix = el.getAttribute('data-suffix') || '';
                    const targetNum = parseFloat(target.replace(/[^0-9.]/g, ''));
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(eased * targetNum);

                        el.textContent = prefix + current.toLocaleString() + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            el.textContent = prefix + targetNum.toLocaleString() + suffix;
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(el => counterObserver.observe(el));
    }

    // ═══════════════════════════════════════════════════════════
    // 8. FAQ Accordion
    // ═══════════════════════════════════════════════════════════
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all
                faqItems.forEach(i => i.classList.remove('active'));
                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ═══════════════════════════════════════════════════════════
    // 9. Contact Form Validation
    // ═══════════════════════════════════════════════════════════
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = contactForm.querySelectorAll('input, textarea');
            let valid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.style.borderColor = '#f87171';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (valid) {
                alert('Message sent successfully! We\'ll get back to you within 24 hours.');
                contactForm.reset();
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    // ═══════════════════════════════════════════════════════════
    // 10. Navbar scroll background
    // ═══════════════════════════════════════════════════════════
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            } else {
                navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
            }
            lastScroll = currentScroll;
        });
    }
});
