document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Sticky Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animations with Staggering
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        
        let delayCounter = 0;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                if (!reveal.classList.contains('active')) {
                    // Stagger elements in a grid
                    if (reveal.closest('.gallery-grid') || reveal.closest('.features-grid')) {
                        reveal.style.transitionDelay = `${delayCounter * 0.15}s`;
                        delayCounter++;
                        // Reset counter after a short delay
                        setTimeout(() => { delayCounter = 0; }, 500);
                    }
                    reveal.classList.add('active');
                }
            }
        });
    };

    // Hero Parallax Effect
    const heroBg = document.querySelector('.hero-bg');
    
    const parallaxScroll = () => {
        if (heroBg) {
            const scrollPos = window.scrollY;
            heroBg.style.transform = `translateY(${scrollPos * 0.4}px) scale(1.05)`;
        }
    };

    window.addEventListener('scroll', () => {
        revealOnScroll();
        parallaxScroll();
    });
    
    // Trigger on load
    setTimeout(revealOnScroll, 100);
});


// Clean URL extensions dynamically
if (window.location.pathname.endsWith('.html')) {
    let cleanUrl = window.location.pathname.replace('/index.html', '/').replace('.html', '');
    window.history.replaceState(null, '', cleanUrl);
}
