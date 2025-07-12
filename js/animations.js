function initAnimations() {
    const elements = document.querySelectorAll('.hero-content, .section-header, .about-grid, .skills-grid, .projects-grid, .contact-grid');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => observer.observe(element));
}