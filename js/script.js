// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            
            // Change hamburger icon
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('show');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
    
    // Smooth Scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header effects
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .timeline-step,
        .benefit-card,
        .problem-card,
        .testimonial-card,
        .criteria-item,
        .specialist-preview
    `);
    
    animateElements.forEach((element, index) => {
        // Set initial state for timeline steps
        if (element.classList.contains('timeline-step')) {
            const card = element.querySelector('.step-card');
            const marker = element.querySelector('.step-marker');
            
            if (card) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = `opacity 0.2s ease ${index * 0.02}s, transform 0.2s ease ${index * 0.02}s`;
            }
            
            if (marker) {
                marker.style.opacity = '0';
                marker.style.transform = marker.style.transform + ' scale(0.5)';
                marker.style.transition = `opacity 0.15s ease ${index * 0.02 + 0.01}s, transform 0.15s ease ${index * 0.02 + 0.01}s`;
            }
            
            // Custom observer for timeline
            const timelineObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const card = entry.target.querySelector('.step-card');
                        const marker = entry.target.querySelector('.step-marker');
                        
                        if (card) {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }
                        
                        if (marker) {
                            marker.style.opacity = '1';
                            marker.style.transform = marker.style.transform.replace('scale(0.5)', 'scale(1)');
                        }
                        
                        timelineObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            timelineObserver.observe(element);
        } else {
            // Regular animation for other elements
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            // Fast animation for all elements
            if (element.classList.contains('specialist-preview') || element.classList.contains('testimonial-card')) {
                element.style.transition = `opacity 0.15s ease ${index * 0.01}s, transform 0.15s ease ${index * 0.01}s`;
            } else {
                element.style.transition = `opacity 0.2s ease ${index * 0.02}s, transform 0.2s ease ${index * 0.02}s`;
            }
            
            // Observe for intersection
            observer.observe(element);
        }
    });
    
    // Counter animation for stats
    const stats = document.querySelectorAll('.stat__number');
    let hasAnimated = false;
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    if (stats.length > 0) {
        statsObserver.observe(stats[0].parentElement.parentElement);
    }
    
    function animateCounters() {
        stats.forEach(stat => {
            const target = stat.textContent;
            const isNumber = !isNaN(target.replace('+', '').replace('k', '000').replace('.', ''));
            
            if (isNumber) {
                let current = 0;
                const targetNum = parseFloat(target.replace('+', '').replace('k', '000'));
                const increment = targetNum / 50;
                const hasK = target.includes('k');
                const hasPlus = target.includes('+');
                const hasDot = target.includes('.');
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetNum) {
                        current = targetNum;
                        clearInterval(timer);
                    }
                    
                    let displayValue = hasDot ? current.toFixed(1) : Math.floor(current);
                    if (hasK && current >= 1000) {
                        displayValue = (current / 1000).toFixed(1) + 'k';
                    }
                    if (hasPlus) {
                        displayValue += '+';
                    }
                    
                    stat.textContent = displayValue;
                }, 30);
            }
        });
    }
    
    // Form handling (if forms are added later)
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add form validation and submission logic here
            console.log('Form submitted');
            
            // Show success message
            showNotification('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
        });
    });
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
                <button class="notification__close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            max-width: 400px;
            border-left: 4px solid ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#8263e8'};
            transform: translateX(450px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(450px)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(450px)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Floating action button (optional)
    function createFloatingButton() {
        const floatingBtn = document.createElement('div');
        floatingBtn.className = 'floating-btn';
        floatingBtn.innerHTML = `
            <i class="fas fa-comments"></i>
            <span>Нужна помощь?</span>
        `;
        
        floatingBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #8263e8, #667eea);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 50px;
            box-shadow: 0 4px 15px rgba(130, 99, 232, 0.4);
            cursor: pointer;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(100px);
        `;
        
        floatingBtn.addEventListener('click', () => {
            // Scroll to contact section or open chat
            const ctaSection = document.querySelector('.cta-section');
            if (ctaSection) {
                ctaSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        floatingBtn.addEventListener('mouseenter', () => {
            floatingBtn.style.transform = 'translateY(-5px) scale(1.05)';
            floatingBtn.style.boxShadow = '0 8px 25px rgba(130, 99, 232, 0.6)';
        });
        
        floatingBtn.addEventListener('mouseleave', () => {
            floatingBtn.style.transform = 'translateY(0) scale(1)';
            floatingBtn.style.boxShadow = '0 4px 15px rgba(130, 99, 232, 0.4)';
        });
        
        document.body.appendChild(floatingBtn);
        
        // Show floating button after scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                floatingBtn.style.opacity = '1';
                floatingBtn.style.transform = 'translateY(0)';
            } else {
                floatingBtn.style.opacity = '0';
                floatingBtn.style.transform = 'translateY(100px)';
            }
        });
    }
    
    // Initialize floating button
    createFloatingButton();
    
    // Preloader (optional)
    function hidePreloader() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }
    
    // Hide preloader when page is loaded
    window.addEventListener('load', hidePreloader);
    
    // Performance optimization: Lazy loading for images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Add click tracking for analytics (placeholder)
    function trackClick(elementName, eventName = 'click') {
        // Integration with analytics services like Google Analytics, Yandex.Metrica
        console.log(`Tracked: ${elementName} - ${eventName}`);
        
        // Example for Google Analytics (gtag)
        // gtag('event', eventName, {
        //     event_category: 'engagement',
        //     event_label: elementName
        // });
    }
    
    // Track important button clicks
    const trackableElements = document.querySelectorAll(`
        .btn--primary,
        .nav__link,
        .footer a,
        .specialist-preview
    `);
    
    trackableElements.forEach(element => {
        element.addEventListener('click', () => {
            const elementText = element.textContent.trim() || element.getAttribute('aria-label') || 'unknown';
            trackClick(elementText);
        });
    });
    
    // How It Works Section Animations
    function initHowItWorksAnimations() {
        const processSteps = document.querySelectorAll('.process-step');
        const guaranteeCard = document.querySelector('.guarantee-card');
        
        // Intersection Observer for step animations
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered animation delay
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        
                        // Animate step number
                        const stepNumber = entry.target.querySelector('.step-number');
                        if (stepNumber) {
                            stepNumber.style.animation = 'stepNumberPulse 0.6s ease-out';
                        }
                        
                        // Animate progress line
                        const progressLine = entry.target.querySelector('.step-progress-line');
                        if (progressLine) {
                            progressLine.style.animation = 'progressLineGrow 0.8s ease-out 0.3s forwards';
                        }
                    }, index * 200);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-50px'
        });
        
        // Apply initial styles and observe steps
        processSteps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(30px)';
            step.style.transition = 'all 0.6s ease-out';
            stepObserver.observe(step);
        });
        
        // Guarantee card hover animation
        if (guaranteeCard) {
            guaranteeCard.addEventListener('mouseenter', () => {
                guaranteeCard.style.transform = 'translateY(-4px) scale(1.02)';
                guaranteeCard.style.boxShadow = '0 16px 48px rgba(130, 99, 232, 0.15)';
            });
            
            guaranteeCard.addEventListener('mouseleave', () => {
                guaranteeCard.style.transform = 'translateY(0) scale(1)';
                guaranteeCard.style.boxShadow = 'none';
            });
        }
        
        // Add click interactions for process steps
        processSteps.forEach((step, index) => {
            const stepContent = step.querySelector('.step-content');
            const stepNumber = step.querySelector('.step-number');
            
            if (stepContent && stepNumber) {
                stepContent.addEventListener('click', () => {
                    // Add ripple effect
                    createRippleEffect(stepContent, event);
                    
                    // Track interaction
                    trackClick(`Process Step ${index + 1}`, 'step_click');
                });
                
                // Add keyboard accessibility
                stepContent.setAttribute('tabindex', '0');
                stepContent.setAttribute('role', 'button');
                stepContent.setAttribute('aria-label', `Шаг ${index + 1}: ${step.querySelector('.step-title')?.textContent}`);
                
                stepContent.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        stepContent.click();
                    }
                });
            }
        });
    }
    
    // Create ripple effect on click
    function createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(130, 99, 232, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'rippleEffect 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add dynamic CSS animations
    function addProcessAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes stepNumberPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            @keyframes progressLineGrow {
                0% { 
                    height: 0; 
                    opacity: 0; 
                }
                100% { 
                    height: 60px; 
                    opacity: 1; 
                }
            }
            
            @keyframes rippleEffect {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(1); opacity: 0; }
            }
            
            .process-step:hover .step-number {
                animation: stepNumberPulse 0.6s ease-out;
            }
            
            .step-content:hover::before {
                background: linear-gradient(90deg, var(--secondary-color), var(--accent-color));
            }
            
            .step-content:focus {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize animations when DOM is ready
    initHowItWorksAnimations();
    addProcessAnimationStyles();
    
    console.log('Legko website initialized successfully! 🎉');
}); 