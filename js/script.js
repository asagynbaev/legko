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
    
    // Header scroll effect and Sticky CTA
    const header = document.querySelector('.header');
    const stickyCta = document.getElementById('sticky-cta');
    let lastScrollTop = 0;
    
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
        
        // Sticky CTA effects
        if (stickyCta) {
            // Show sticky CTA after scrolling past hero section
            if (scrollTop > window.innerHeight * 0.8) {
                stickyCta.classList.add('show');
            } else {
                stickyCta.classList.remove('show');
            }
        }
        
        lastScrollTop = scrollTop;
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
        .timeline-item,
        .benefit-card,
        .problem-card,
        .testimonial-card,
        .criteria-item,
        .specialist-preview
    `);
    
    animateElements.forEach((element, index) => {
        // Set initial state for timeline items
        if (element.classList.contains('timeline-item')) {
            const card = element.querySelector('.timeline-card');
            const marker = element.querySelector('.timeline-marker');
            
            if (card) {
                card.style.opacity = '0';
                card.style.transform = element.classList.contains('timeline-item--left') 
                    ? 'translateX(-50px)' : 'translateX(50px)';
                card.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
            }
            
            if (marker) {
                marker.style.opacity = '0';
                marker.style.transform = 'translateX(-50%) scale(0.5)';
                marker.style.transition = `opacity 0.6s ease ${index * 0.2 + 0.1}s, transform 0.6s ease ${index * 0.2 + 0.1}s`;
            }
            
            // Custom observer for timeline
            const timelineObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const card = entry.target.querySelector('.timeline-card');
                        const marker = entry.target.querySelector('.timeline-marker');
                        
                        if (card) {
                            card.style.opacity = '1';
                            card.style.transform = 'translateX(0)';
                        }
                        
                        if (marker) {
                            marker.style.opacity = '1';
                            marker.style.transform = 'translateX(-50%) scale(1)';
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
            
            // Faster animation for specialists and testimonials
            if (element.classList.contains('specialist-preview') || element.classList.contains('testimonial-card')) {
                element.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
            } else {
                element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
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
    
    console.log('Legko website initialized successfully! 🎉');
}); 