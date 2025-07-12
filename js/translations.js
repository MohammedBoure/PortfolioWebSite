let translations = {};

async function loadTranslations(lang) {
    try {
        const response = await fetch(`./lang/${lang}.json`);
        if (!response.ok) throw new Error(`Failed to load ${lang}.json: ${response.status}`);
        translations[lang] = await response.json();
        updateContent(lang);
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function updateContent(lang) {
    if (!translations[lang]) {
        console.warn(`Translations for language "${lang}" not loaded`);
        return;
    }
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[lang][key]?.includes('<span')) {
            element.innerHTML = translations[lang][key];
        } else {
            element.textContent = translations[lang][key] || '';
        }
    });
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(element => {
        const key = element.getAttribute('name');
        element.placeholder = translations[lang][key] || element.placeholder;
    });
}