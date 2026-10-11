/**
 * Guru Vashishta Woods - Dynamic Interactivity & UI Engine
 * Features: Live Filter & Search, Quick View Modal, Bespoke Configurator,
 * Scroll Animations, WhatsApp Integration, Animated Counters, and URL Pre-filling.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderAndNav();
    initScrollReveal();
    initAnimatedCounters();
    initCatalogFilterAndSearch();
    initHorizontalSliders();
    initQuickViewModal();
    initConfigurator();
    initBackToTop();
    initContactFormPreFill();
    initFormSecurity();
    initParallax();
});

/* ==========================================================================
   Header & Mobile Navigation (90fps rAF-Synchronized Scroll State)
   ========================================================================== */
function initHeaderAndNav() {
    const header = document.querySelector('header');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // High-refresh-rate (90fps/120fps) rAF scroll state guard
    let isScrolled = null;
    let scrollTicking = false;

    const updateHeaderState = () => {
        const shouldBeScrolled = window.scrollY > 40;
        if (shouldBeScrolled !== isScrolled) {
            isScrolled = shouldBeScrolled;
            if (isScrolled) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }
        }
        scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(updateHeaderState);
        }
    }, { passive: true });
    updateHeaderState();

    // Mobile drawer toggle
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            }
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
                document.body.style.overflow = '';
            }
        });

        // Close on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
                document.body.style.overflow = '';
            });
        });

        // Close on window resize if expanded past mobile breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991 && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
                document.body.style.overflow = '';
            }
        }, { passive: true });
    }
}

/* ==========================================================================
   High Performance Scroll Reveal via IntersectionObserver
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.1
        });

        reveals.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        reveals.forEach(el => el.classList.add('active'));
    }
}

/* ==========================================================================
   Animated Number Counters (e.g. 100% In-House, 100% FSC, 100% Commitment)
   ========================================================================== */
function initAnimatedCounters() {
    const statCards = document.querySelectorAll('.stat-num, .counter-num');
    if (!statCards.length) return;

    const animateCount = (el) => {
        const target = parseInt(el.getAttribute('data-target') || el.innerText.replace(/\D/g, ''), 10) || 100;
        const suffix = el.getAttribute('data-suffix') || '%';
        const duration = 1800;
        const start = performance.now();

        const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            // EaseOutExpo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(ease * target);
            el.innerText = `${current}${suffix}`;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.innerText = `${target}${suffix}`;
            }
        };
        requestAnimationFrame(update);
    };

    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        statCards.forEach(card => obs.observe(card));
    } else {
        statCards.forEach(card => animateCount(card));
    }
}

/* ==========================================================================
   Smooth 90fps Horizontal Sliders (.filter-pills, .hero-categories-grid, .hero-trust-bar)
   ========================================================================== */
function initHorizontalSliders() {
    const sliders = document.querySelectorAll('.filter-pills, .hero-categories-grid, .hero-trust-bar');
    if (!sliders.length) return;

    sliders.forEach(slider => {
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;
        let hasDragged = false;

        // Pointer / mouse drag support for desktop & hybrid devices (touch uses native 90fps momentum)
        slider.addEventListener('mousedown', (e) => {
            if (slider.scrollWidth <= slider.clientWidth) return;
            isDown = true;
            hasDragged = false;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
            slider.style.cursor = 'grabbing';
        });

        slider.addEventListener('mouseleave', () => {
            if (!isDown) return;
            isDown = false;
            slider.style.cursor = '';
        });

        slider.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            slider.style.cursor = '';
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5;
            if (Math.abs(walk) > 5) {
                hasDragged = true;
                e.preventDefault();
                slider.scrollLeft = scrollLeft - walk;
            }
        });

        // Prevent accidental click trigger after mouse drag
        slider.addEventListener('click', (e) => {
            if (hasDragged) {
                e.preventDefault();
                e.stopPropagation();
                hasDragged = false;
            }
        }, true);
    });
}

/* ==========================================================================
   Live Search & Dynamic Category Filter for Products / Gallery
   ========================================================================== */
function initCatalogFilterAndSearch() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.querySelector('.search-input');
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
    const countBadge = document.getElementById('productCount');

    if (!galleryItems.length) return;

    let activeCategory = 'all';
    let searchQuery = '';

    const applyFilters = () => {
        let visibleCount = 0;
        const toShow = [];
        const toHide = [];

        galleryItems.forEach(item => {
            const itemCat = (item.getAttribute('data-category') || '').toLowerCase();
            const titleEl = item.querySelector('h3');
            const descEl = item.querySelector('p');
            const itemText = `${titleEl?.innerText || ''} ${descEl?.innerText || ''}`.toLowerCase();

            const matchesCategory = activeCategory === 'all' || itemCat.includes(activeCategory);
            const matchesSearch = !searchQuery || itemText.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                toShow.push(item);
                visibleCount++;
            } else {
                toHide.push(item);
            }
        });

        requestAnimationFrame(() => {
            toShow.forEach(item => {
                item.style.display = '';
                requestAnimationFrame(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translate3d(0, 0, 0) scale(1)';
                });
            });

            toHide.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translate3d(0, 0, 0) scale(0.96)';
                setTimeout(() => {
                    if (item.style.opacity === '0') item.style.display = 'none';
                }, 260);
            });

            if (countBadge) {
                countBadge.innerText = `${visibleCount}`;
            }
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-filter') || 'all';

            // Smoothly center the tapped category pill inside the horizontal slider on mobile
            const pillContainer = btn.closest('.filter-pills');
            if (pillContainer && pillContainer.scrollWidth > pillContainer.clientWidth) {
                const targetScroll = btn.offsetLeft - (pillContainer.clientWidth / 2) + (btn.offsetWidth / 2);
                pillContainer.scrollTo({
                    left: Math.max(0, targetScroll),
                    behavior: 'smooth'
                });
            }

            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            applyFilters();
        });
    }
}

/* ==========================================================================
   Interactive Dynamic Product Quick View Modal
   ========================================================================== */
function initQuickViewModal() {
    // Ensure modal HTML exists in DOM
    let modalBackdrop = document.querySelector('.modal-backdrop');
    if (!modalBackdrop) {
        modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'modal-backdrop';
        modalBackdrop.innerHTML = `
            <div class="modal-content" role="dialog" aria-modal="true">
                <button class="modal-close-btn" aria-label="Close modal"><i class="fas fa-times"></i></button>
                <div class="modal-body">
                    <div class="modal-image-col">
                        <img src="" alt="Product Preview" id="modalProductImg">
                    </div>
                    <div class="modal-details-col">
                        <span class="modal-category-tag" id="modalCategory">Handcrafted Solid Wood</span>
                        <h2 id="modalTitle">Product Title</h2>
                        <div class="modal-subtitle" id="modalSubtitle">Subheading</div>
                        <p class="modal-description" id="modalDesc">Product description will be shown here.</p>
                        
                        <div class="modal-specs-box">
                            <ul>
                                <li><i class="fas fa-check-circle"></i> <span>100% FSC-Certified Seasoned Wood</span></li>
                                <li><i class="fas fa-hammer"></i> <span>Artisanal Hand-Carved Joinery</span></li>
                                <li><i class="fas fa-layer-group"></i> <span>Customizable Sizing & Finishes</span></li>
                                <li><i class="fas fa-map-marker-alt"></i> <span>Jaipur Workshop Direct Manufacturing</span></li>
                            </ul>
                        </div>

                        <div class="modal-finishes-title">Select Handcrafted Finish:</div>
                        <div class="modal-finishes-list">
                            <span class="finish-chip active" data-finish="Solid Teak (Natural)">Solid Teak</span>
                            <span class="finish-chip" data-finish="Imperial Sheesham">Sheesham</span>
                            <span class="finish-chip" data-finish="American Walnut">Walnut</span>
                            <span class="finish-chip" data-finish="Antique Honey">Antique Finish</span>
                        </div>

                        <div class="modal-action-row">
                            <a href="#" class="btn btn-primary" id="modalWhatsAppBtn" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-whatsapp"></i> Inquire via WhatsApp
                            </a>
                            <a href="contact.html" class="btn" id="modalQuoteBtn">
                                Request Quote
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalBackdrop);
    }

    const modalImg = modalBackdrop.querySelector('#modalProductImg');
    const modalTitle = modalBackdrop.querySelector('#modalTitle');
    const modalSubtitle = modalBackdrop.querySelector('#modalSubtitle');
    const modalDesc = modalBackdrop.querySelector('#modalDesc');
    const modalCategory = modalBackdrop.querySelector('#modalCategory');
    const modalWhatsAppBtn = modalBackdrop.querySelector('#modalWhatsAppBtn');
    const modalQuoteBtn = modalBackdrop.querySelector('#modalQuoteBtn');
    const closeBtn = modalBackdrop.querySelector('.modal-close-btn');
    const finishChips = modalBackdrop.querySelectorAll('.finish-chip');

    let currentTitle = '';
    let currentFinish = 'Solid Teak (Natural)';

    const updateWhatsAppLink = () => {
        if (!modalWhatsAppBtn) return;
        const msg = encodeURIComponent(`Hello Guru Vashishta Woods! I am interested in customizing the "${currentTitle}" with ${currentFinish} wood finish. Please share details and bespoke pricing.`);
        modalWhatsAppBtn.href = `https://wa.me/919519766601?text=${msg}`;
    };

    finishChips.forEach(chip => {
        chip.addEventListener('click', () => {
            finishChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFinish = chip.getAttribute('data-finish') || 'Solid Teak';
            updateWhatsAppLink();
        });
    });

    const openModal = (card) => {
        const img = card.querySelector('img')?.src || '';
        const title = card.querySelector('h3')?.innerText || 'Handmade Furniture';
        const subtitle = card.querySelector('.gallery-overlay p')?.innerText || 'Antique Finish with Premium Wood';
        const category = card.getAttribute('data-category') || 'Luxury Furniture';

        currentTitle = title;
        if (modalImg) modalImg.src = img;
        if (modalTitle) modalTitle.innerText = title;
        if (modalSubtitle) modalSubtitle.innerText = subtitle;
        if (modalDesc) modalDesc.innerText = `Every piece of the ${title} is 100% handcrafted in our Jaipur workshop by master artisans using seasoned, sustainably harvested wood for timeless durability.`;
        if (modalCategory) modalCategory.innerText = category;
        if (modalQuoteBtn) modalQuoteBtn.href = `contact.html?product=${encodeURIComponent(title)}`;

        updateWhatsAppLink();

        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
            closeModal();
        }
    });

    // Attach click listeners to cards and quick-action triggers
    document.querySelectorAll('.gallery-item').forEach(card => {
        const quickViewBtn = card.querySelector('.btn-quick-view') || card.querySelector('.action-circle-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openModal(card);
            });
        }
        
        // Clicking image directly also opens quick view
        const img = card.querySelector('img');
        if (img) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => openModal(card));
        }
    });
}

/* ==========================================================================
   Interactive Bespoke Furniture Configurator & Live Estimator
   ========================================================================== */
function initConfigurator() {
    const configurator = document.querySelector('.configurator-wrapper');
    if (!configurator) return;

    let selectedSpace = 'Living Room';
    let selectedWood = '100% FSC Teak Wood';
    let selectedFinish = 'Natural Matte Oil';
    let selectedScale = 'Standard Residential';

    const spaceChips = configurator.querySelectorAll('[data-step="space"] .config-chip');
    const woodChips = configurator.querySelectorAll('[data-step="wood"] .config-chip');
    const finishChips = configurator.querySelectorAll('[data-step="finish"] .config-chip');
    const scaleChips = configurator.querySelectorAll('[data-step="scale"] .config-chip');

    const summarySpace = document.getElementById('summarySpace');
    const summaryWood = document.getElementById('summaryWood');
    const summaryFinish = document.getElementById('summaryFinish');
    const summaryScale = document.getElementById('summaryScale');
    const configWhatsAppBtn = document.getElementById('configWhatsAppBtn');
    const configQuoteBtn = document.getElementById('configQuoteBtn');

    const updateSummary = () => {
        if (summarySpace) summarySpace.innerText = selectedSpace;
        if (summaryWood) summaryWood.innerText = selectedWood;
        if (summaryFinish) summaryFinish.innerText = selectedFinish;
        if (summaryScale) summaryScale.innerText = selectedScale;

        const specText = `${selectedSpace} custom piece in ${selectedWood} with ${selectedFinish} (${selectedScale})`;
        
        if (configWhatsAppBtn) {
            const msg = encodeURIComponent(`Hello Guru Vashishta Woods! I configured a bespoke piece:
- Category: ${selectedSpace}
- Wood Type: ${selectedWood}
- Finish: ${selectedFinish}
- Requirement Scale: ${selectedScale}
Please advise on timeline and quotation.`);
            configWhatsAppBtn.href = `https://wa.me/919519766601?text=${msg}`;
        }

        if (configQuoteBtn) {
            configQuoteBtn.href = `contact.html?spec=${encodeURIComponent(specText)}`;
        }
    };

    const attachChipListeners = (chips, callback) => {
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                callback(chip.innerText.trim());
                updateSummary();
            });
        });
    };

    attachChipListeners(spaceChips, val => { selectedSpace = val; });
    attachChipListeners(woodChips, val => { selectedWood = val; });
    attachChipListeners(finishChips, val => { selectedFinish = val; });
    attachChipListeners(scaleChips, val => { selectedScale = val; });

    updateSummary();
}

/* ==========================================================================
   Back to Top Floating Button (90fps rAF-Synchronized)
   ========================================================================== */
function initBackToTop() {
    let btn = document.querySelector('.back-to-top');
    if (!btn) {
        btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        document.body.appendChild(btn);
    }

    let isVisible = false;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                const shouldShow = window.scrollY > 350;
                if (shouldShow !== isVisible) {
                    isVisible = shouldShow;
                    if (isVisible) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                }
                ticking = false;
            });
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ==========================================================================
   Input Sanitization & Security Helper
   ========================================================================== */
function sanitizeSafeText(str, maxLength = 200) {
    if (!str || typeof str !== 'string') return '';
    return str
        .replace(/<[^>]*>?/gm, '') // Strip HTML tags
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Strip control chars
        .replace(/[<>"'`]/g, '') // Strip injection characters
        .trim()
        .slice(0, maxLength);
}

/* ==========================================================================
   Contact Page Auto-Fill from URL Parameters (Sanitized & Secure)
   ========================================================================== */
function initContactFormPreFill() {
    const messageInput = document.querySelector('textarea[name="Message"]');
    if (!messageInput) return;

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productParam = urlParams.get('product');
        const specParam = urlParams.get('spec');

        if (productParam) {
            const cleanProduct = sanitizeSafeText(decodeURIComponent(productParam), 120);
            if (cleanProduct) {
                messageInput.value = `Hello Guru Vashishta Woods,\n\nI am inquiring about the "${cleanProduct}". Please provide customization details, wood options, and pricing information.`;
            }
        } else if (specParam) {
            const cleanSpec = sanitizeSafeText(decodeURIComponent(specParam), 250);
            if (cleanSpec) {
                messageInput.value = `Hello Guru Vashishta Woods,\n\nI would like a custom quote for the following bespoke configuration:\n${cleanSpec}\n\nPlease share manufacturing lead time and pricing.`;
            }
        }
    } catch (e) {
        console.warn('URL parameter safe parsing caught: ', e);
    }
}

/* ==========================================================================
   Form Security & Anti-Bot Honeypot Defense
   ========================================================================== */
function initFormSecurity() {
    const forms = document.querySelectorAll('form[action*="formsubmit.co"]');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            // Check honeypot field
            const honey = form.querySelector('input[name="_honey"]');
            if (honey && honey.value.trim() !== '') {
                // Automated bot trapped in honeypot! Intercept silently.
                e.preventDefault();
                return false;
            }

            // Input sanitization and validation
            const nameInput = form.querySelector('input[name="Name"]');
            const emailInput = form.querySelector('input[name="Email"]');
            const phoneInput = form.querySelector('input[name="Phone"]');
            const msgInput = form.querySelector('textarea[name="Message"]');

            if (nameInput) nameInput.value = sanitizeSafeText(nameInput.value, 100);
            if (emailInput) emailInput.value = emailInput.value.trim().slice(0, 120);
            if (phoneInput) phoneInput.value = phoneInput.value.trim().slice(0, 25);
            
            if (msgInput) {
                // Block script tag injections
                if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(msgInput.value)) {
                    e.preventDefault();
                    alert('Invalid input detected. Please remove script tags.');
                    return false;
                }
            }

            // Prevent double submits / rapid clicking
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                // Timeout safeguard in case submission is cancelled or fails
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 8000);
            }
        });
    });
}

/* ==========================================================================
   Hero Subtle Parallax Effect (90fps rAF-Synchronized, Desktop Only)
   ========================================================================== */
function initParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    // Skip JS parallax on mobile/touch viewports so native compositor scrolling stays locked at 90fps/120fps
    if (window.matchMedia('(max-width: 991px), (prefers-reduced-motion: reduce)').matches) {
        return;
    }

    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            parallaxTicking = true;
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;
                if (scrolled < window.innerHeight) {
                    heroBg.style.transform = `translate3d(0, ${(scrolled * 0.25).toFixed(1)}px, 0) scale(1.05)`;
                }
                parallaxTicking = false;
            });
        }
    }, { passive: true });
}
