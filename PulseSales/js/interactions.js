// js/interactions.js

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    toast.innerHTML = `<i data-lucide="${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sidebar Mobile Toggle
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle-btn');
    const mobileClose = document.getElementById('mobile-close-btn');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => sidebar.classList.add('open'));
    }

    if (mobileClose && sidebar) {
        mobileClose.addEventListener('click', () => sidebar.classList.remove('open'));
    }

    // 2. Tab Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const pageTitle = document.getElementById('page-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = item.getAttribute('data-tab');
            if (!targetTab) return;

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            tabPanes.forEach(pane => {
                if (pane.id === `tab-${targetTab}`) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });

            // Update title
            if (pageTitle) {
                const text = item.querySelector('span').textContent;
                pageTitle.textContent = text;
            }
            
            // Force charts to resize if they were hidden
            window.dispatchEvent(new Event('resize'));
            
            if (sidebar && window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // 3. Timeframe segment controls
    const segmentedBtns = document.querySelectorAll('.segmented-control button');
    segmentedBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            showToast(`Timeframe updated to ${e.target.dataset.range}`);
        });
    });

    // 4. Refresh Button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const icon = refreshBtn.querySelector('i');
            if (icon) {
                icon.style.transition = 'transform 0.5s ease';
                icon.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    icon.style.transition = 'none';
                    icon.style.transform = 'rotate(0deg)';
                }, 500);
            }
            showToast('Dashboard data refreshed');
        });
    }
});
