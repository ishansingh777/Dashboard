// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize data loading
    if (typeof loadDashboardData === 'function') {
        loadDashboardData();
    }

    // 2. Start mock realtime engine
    if (typeof setupMockRealtime === 'function') {
        setupMockRealtime();
    }

    // 3. Tab switching logic
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Close mobile menu on select
            const sidebar = document.getElementById('sidebar');
            if (sidebar && window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // 4. Refresh Button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const icon = refreshBtn.querySelector('i');
            if (icon) icon.classList.add('spin-anim');
            setTimeout(() => {
                if (icon) icon.classList.remove('spin-anim');
                if (typeof showToast === 'function') showToast('Dashboard data refreshed', 'success');
            }, 800);
        });
    }
});
