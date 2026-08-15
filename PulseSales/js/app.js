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
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = item.getAttribute('data-tab');
            if (!targetTab) return;

            // Update nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Smoothly update tab panes
            tabPanes.forEach(pane => {
                if (pane.id === `tab-${targetTab}`) {
                    pane.classList.add('active');
                    pane.style.animation = 'fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                } else {
                    pane.classList.remove('active');
                    pane.style.animation = 'none';
                }
            });
            
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
