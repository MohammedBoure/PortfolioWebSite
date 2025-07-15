document.addEventListener('DOMContentLoaded', () => {
    const languageSwitchers = [
        document.getElementById('language-switcher'),
        document.getElementById('language-switcher-sidebar')
    ].filter(Boolean); // Remove nulls

    const themeToggles = [
        document.getElementById('theme-toggle'),
        document.getElementById('theme-toggle-sidebar')
    ].filter(Boolean);

    if (languageSwitchers.length === 0) {
        console.error('No language switcher elements found');
        return;
    }
    if (themeToggles.length === 0) {
        console.error('No theme toggle elements found');
        return;
    }

    emailjs.init({ publicKey: '2A1sEYFcFtuAXeeOU' }); // Replace with your actual EmailJS public key

    const savedLang = localStorage.getItem('language') || 'en';
    document.documentElement.lang = savedLang;
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

    // Set both selectors to the saved language
    languageSwitchers.forEach(el => {
        el.value = savedLang;
    });

    loadTranslations(savedLang).then(() => {
        loadProjects();
        updateLayoutDirection(savedLang); // Ensure layout updates
    }).catch(error => {
        console.error('Failed to initialize translations:', error);
        updateContent(savedLang);
        loadProjects();
        updateLayoutDirection(savedLang);
    });

    // Language switcher event
    languageSwitchers.forEach(switcher => {
        switcher.addEventListener('change', (e) => {
            const lang = e.target.value;
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            localStorage.setItem('language', lang);

            // Sync the other switcher
            languageSwitchers.forEach(other => {
                if (other !== switcher) {
                    other.value = lang;
                }
            });

            loadTranslations(lang).then(() => {
                renderProjects(lang);
                updateLayoutDirection(lang); // Update layout
            }).catch(error => {
                console.error('Failed to load translations:', error);
                updateContent(lang);
                renderProjects(lang);
                updateLayoutDirection(lang);
            });
        });
    });

    // Theme toggle event
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggleTheme(); // Defined in theme.js
        });
    });

    // Initialize features
    initTheme();
    initSidebar();
    initForm();
    initAnimations();

    // Scroll event to hide/show mobile settings
    const mobileSettings = document.querySelector('.mobile-settings');
    let lastScrollY = window.scrollY;

    if (mobileSettings) {
        window.addEventListener('scroll', () => {
            if (window.innerWidth <= 768) {
                const currentScrollY = window.scrollY;
                if (currentScrollY > lastScrollY && currentScrollY > 50) {
                    mobileSettings.style.display = 'none';
                } else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
                    mobileSettings.style.display = 'flex';
                }
                lastScrollY = currentScrollY;
            }
        });
    }

    // Force layout update for RTL/LTR
    function updateLayoutDirection(lang) {
        document.body.classList.toggle('rtl', lang === 'ar');
        document.querySelectorAll('.container, .nav-links, .settings-control').forEach(element => {
            element.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
            element.style.textAlign = lang === 'ar' ? 'right' : 'left';
        });
    }
});