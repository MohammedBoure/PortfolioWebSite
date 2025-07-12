document.addEventListener('DOMContentLoaded', () => {
    const languageSwitcher = document.getElementById('language-switcher');
    if (!languageSwitcher) {
        console.error('Language switcher element (#language-switcher) not found');
        return;
    }

    // Initialize translations
    const savedLang = localStorage.getItem('language') || 'ar';
    languageSwitcher.value = savedLang;
    document.documentElement.lang = savedLang;
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    loadTranslations(savedLang).then(() => {
        renderProjects(savedLang); // Ensure projects are rendered after translations
    });

    // Initialize projects
    loadProjects();

    // Initialize theme
    initTheme();

    // Initialize sidebar
    initSidebar();

    // Initialize form
    initForm();

    // Initialize animations
    initAnimations();

    // Initialize EmailJS
    emailjs.init({
        publicKey: '2A1sEYFcFtuAXeeOU' // Replace with your EmailJS public key
    });

    // Language switcher
    languageSwitcher.addEventListener('change', (e) => {
        const lang = e.target.value;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        loadTranslations(lang).then(() => {
            renderProjects(lang); // Re-render projects on language change
        });
        localStorage.setItem('language', lang);
    });
});