// js/theme.js
const THEME_KEY = 'pulseSales_theme';

function getSavedTheme() {
    return localStorage.getItem(THEME_KEY) || 'light-mode';
}

function applyTheme(theme) {
    document.body.className = theme;
    localStorage.setItem(THEME_KEY, theme);
    
    // Update icon
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        const icon = theme === 'dark-mode' ? 'sun' : 'moon';
        themeBtn.innerHTML = `<i data-lucide="${icon}"></i>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Dispatch event for charts to redraw
    window.dispatchEvent(new Event('themeChanged'));
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getSavedTheme());
    
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
            applyTheme(current === 'dark-mode' ? 'light-mode' : 'dark-mode');
        });
    }
});
