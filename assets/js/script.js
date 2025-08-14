// ROADSAFE - JavaScript Principal
// Funcionalidades: Navegación, Animaciones, Formularios, Scroll Effects

(function() {
    'use strict';

    // Variables globales
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const contactForm = document.getElementById('contactForm');
    const header = document.querySelector('.header');
    
    // Inicialización cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        initNavigation();
        initScrollEffects();
        initAnimations();
        initContactForm();
        initSmoothScrolling();
        initHeaderScroll();
        initFAQ();
    });

    // === NAVEGACIÓN MÓVIL NUEVA ===
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    function initNavigation() {
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileMenu);
        }
        
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeMobileMenu);
        }
        
        // Cerrar menú al hacer click en un enlace móvil
        if (mobileMenu) {
            const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        }
    }

    function toggleMobileMenu() {
        if (mobileMenu && mobileOverlay) {
            const isActive = mobileMenu.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }
    }
    
    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animación del hamburger
        const hamburgers = navToggle.querySelectorAll('.hamburger');
        hamburgers.forEach((hamburger, index) => {
            if (index === 0) hamburger.style.transform = 'rotate(45deg) translate(6px, 6px)';
            if (index === 1) hamburger.style.opacity = '0';
            if (index === 2) hamburger.style.transform = 'rotate(-45deg) translate(6px, -6px)';
        });
    }

    function closeMobileMenu() {
        if (mobileMenu && mobileOverlay) {
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Resetear animación del hamburger
            const hamburgers = navToggle.querySelectorAll('.hamburger');
            hamburgers.forEach(hamburger => {
                hamburger.style.transform = 'none';
                hamburger.style.opacity = '1';
            });
        }
    }

    // === EFECTOS DE SCROLL ===
    function initScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observar elementos para animaciones
        const animatedElements = document.querySelectorAll(
            '.service-card, .feature-item, .stat-item, .contact-item, .hero-content, .hero-image'
        );
        
        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // === ANIMACIONES ===
    function initAnimations() {
        // Animación de contadores
        const statNumbers = document.querySelectorAll('.stat-number');
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });

        // Animación de las tarjetas de servicio
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    function animateCounter(element) {
        const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
        const increment = target / 50;
        let current = 0;
        const suffix = element.textContent.replace(/[0-9,]/g, '');
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const formattedNumber = Math.floor(current).toLocaleString();
            element.textContent = formattedNumber + suffix;
        }, 40);
    }

    // === SCROLL SUAVE ===
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Cerrar menú móvil si está abierto
                    closeMobileMenu();
                }
            });
        });
    }

    // === HEADER SCROLL ===
    function initHeaderScroll() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Cambiar estilo del header al hacer scroll
            if (scrollTop > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
            
            // Ocultar/mostrar header en scroll
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // === FORMULARIO DE CONTACTO ===
    function initContactForm() {
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
            
            // Validación en tiempo real
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearFieldError);
            });
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formObject = {};
        
        // Convertir FormData a objeto
        for (let [key, value] of formData.entries()) {
            formObject[key] = value;
        }
        
        // Validar formulario
        if (validateForm(formObject)) {
            submitForm(formObject);
        }
    }

    function validateForm(data) {
        let isValid = true;
        
        // Validar nombre
        if (!data.name || data.name.trim().length < 2) {
            showFieldError('name', 'El nombre debe tener al menos 2 caracteres');
            isValid = false;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showFieldError('email', 'Ingresa un email válido');
            isValid = false;
        }
        
        // Validar teléfono
        const phoneRegex = /^[+]?[0-9\s\-\(\)]{8,}$/;
        if (!data.phone || !phoneRegex.test(data.phone)) {
            showFieldError('phone', 'Ingresa un teléfono válido');
            isValid = false;
        }
        
        // Validar servicio
        if (!data.service) {
            showFieldError('service', 'Selecciona un servicio');
            isValid = false;
        }
        
        return isValid;
    }

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        switch (field.name) {
            case 'name':
                if (value.length < 2) {
                    showFieldError('name', 'El nombre debe tener al menos 2 caracteres');
                } else {
                    clearFieldError(field);
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showFieldError('email', 'Ingresa un email válido');
                } else {
                    clearFieldError(field);
                }
                break;
                
            case 'phone':
                const phoneRegex = /^[+]?[0-9\s\-\(\)]{8,}$/;
                if (!phoneRegex.test(value)) {
                    showFieldError('phone', 'Ingresa un teléfono válido');
                } else {
                    clearFieldError(field);
                }
                break;
        }
    }

    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        
        // Remover error anterior
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Agregar nuevo error
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        
        formGroup.appendChild(errorElement);
        field.style.borderColor = '#ef4444';
    }

    function clearFieldError(field) {
        if (field.target) field = field.target;
        
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.field-error');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        field.style.borderColor = '#e5e7eb';
    }

    function submitForm(data) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Mostrar estado de carga
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        contactForm.classList.add('loading');
        
        // Simular envío (aquí integrarías con tu backend)
        setTimeout(() => {
            // Simular respuesta exitosa
            showSuccessMessage();
            contactForm.reset();
            
            // Restaurar botón
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            contactForm.classList.remove('loading');
        }, 2000);
    }

    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div style="
                background-color: #10b981;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                text-align: center;
                font-weight: 500;
            ">
                ✓ ¡Mensaje enviado exitosamente! Te contactaremos pronto.
            </div>
        `;
        
        contactForm.insertBefore(successMessage, contactForm.firstChild);
        
        // Remover mensaje después de 5 segundos
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // === UTILIDADES ===
    
    // Throttle function para optimizar eventos de scroll
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Debounce function para optimizar eventos de resize
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // === EVENTOS DE RESIZE ===
    window.addEventListener('resize', debounce(function() {
        // Cerrar menú móvil en resize
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    }, 250));

    // === MANEJO DE ERRORES ===
    window.addEventListener('error', function(e) {
        console.error('Error en ROADSAFE:', e.error);
    });

    // === PRELOADER (opcional) ===
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Remover preloader si existe
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 300);
        }
    });

    // === LAZY LOADING PARA IMÁGENES ===
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // === DETECCIÓN DE DISPOSITIVO ===
    function detectDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth > 768;
        
        document.body.classList.add(isMobile ? 'is-mobile' : 'is-desktop');
        if (isTablet) document.body.classList.add('is-tablet');
    }

    // Inicializar detección de dispositivo
    detectDevice();

    // === ACCESIBILIDAD ===
    
    // Navegación por teclado
    document.addEventListener('keydown', function(e) {
        // Escape para cerrar menú móvil
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
        
        // Enter en elementos focusables
        if (e.key === 'Enter' && e.target.classList.contains('nav-toggle')) {
            toggleMobileMenu();
        }
    });

    // Indicador de focus visible
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // === ANALYTICS Y TRACKING (opcional) ===
    function trackEvent(category, action, label) {
        // Integración con Google Analytics o similar
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }

    // Tracking de clics en botones importantes
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-primary')) {
            trackEvent('Button', 'Click', 'Primary CTA');
        }
        
        if (e.target.closest('.service-card')) {
            trackEvent('Service', 'Click', 'Service Card');
        }
    });

    // === FAQ FUNCTIONALITY ===
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                // Cerrar otros items abiertos
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle del item actual
                item.classList.toggle('active');
            });
        });
        
        // Cerrar FAQ al presionar Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                faqItems.forEach(item => {
                    item.classList.remove('active');
                });
            }
        });
    }

})();

// === FUNCIONES GLOBALES DISPONIBLES ===
window.ROADSAFE = {
    // Función para mostrar notificaciones
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        // Colores según tipo
        const colors = {
            info: '#2563eb',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    },
    
    // Función para scroll suave a elemento
    scrollTo: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
};