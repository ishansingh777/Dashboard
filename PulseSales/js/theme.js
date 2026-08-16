// js/theme.js

document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Load saved theme
    const savedTheme = localStorage.getItem('pulse_theme');
    if (savedTheme === 'dark') {
        enableDark();
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                enableLight();
            } else {
                enableDark();
            }
        });
    }

    function enableDark() {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('pulse_theme', 'dark');
        updateIcon('sun');
        dispatchThemeEvent();
    }

    function enableLight() {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('pulse_theme', 'light');
        updateIcon('moon');
        dispatchThemeEvent();
    }

    function updateIcon(iconName) {
        if (themeBtn && typeof lucide !== 'undefined') {
            themeBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
            lucide.createIcons();
        }
    }

    function dispatchThemeEvent() {
        const event = new Event('themeChanged');
        document.dispatchEvent(event);
    }
});
