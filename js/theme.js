function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = themeToggle?.querySelector('.sun');
    const moonIcon = themeToggle?.querySelector('.moon');

    if (!themeToggle || !sunIcon || !moonIcon) {
        console.error('Theme toggle or icons not found');
        return;
    }

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);

    // Add both click and touchstart for mobile compatibility
    ['click', 'touchstart'].forEach(eventType => {
        themeToggle.addEventListener(eventType, (e) => {
            e.preventDefault();
            e.stopPropagation();
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
            console.log('Theme switched to:', newTheme);
        });
    });

    function updateThemeIcons(theme) {
        sunIcon.style.display = theme === 'light' ? 'inline' : 'none';
        moonIcon.style.display = theme === 'dark' ? 'inline' : 'none';
    }
}
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}