// Enhanced copy of premium-animations.js without transform that breaks fixed positioning
// This version uses 'top' instead of 'transform' for parallax effect

// Scroll Reveal Observer
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Initialize scroll reveal on page load
document.addEventListener('DOMContentLoaded', () => {
    // Reveal sections
    const revealSections = document.querySelectorAll('.features, .menu, .about, .testimonials, .contact');
    revealSections.forEach(section => {
        section.classList.add('reveal');
        scrollRevealObserver.observe(section);
    });

    // Reveal product cards with stagger
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.classList.add('reveal-stagger');
        scrollRevealObserver.observe(card);
    });

    // Reveal testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.classList.add('reveal');
        scrollRevealObserver.observe(card);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// REMOVED: Parallax effect that was breaking position:fixed
// The transform property on any parent element creates a containing block
// which prevents position:fixed from working correctly

console.log('Premium enhancements loaded successfully!');
