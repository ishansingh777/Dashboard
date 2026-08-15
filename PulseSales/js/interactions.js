// js/interactions.js

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i data-lucide="info"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menu-toggle-btn');
    const mobileClose = document.getElementById('mobile-close-btn');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    }

    if (mobileClose && sidebar) {
        mobileClose.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // Modal Logic
    const reportBtn = document.getElementById('generate-report-btn');
    const aiAssistantBtn = document.getElementById('ai-assistant-trigger');
    const modalOverlay = document.getElementById('ai-report-modal');
    const closeBtns = document.querySelectorAll('.close-modal');

    function openModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.add('active');
        
        // Simulate AI generation
        document.getElementById('ai-report-skeleton').classList.remove('hidden');
        document.getElementById('ai-report-content').classList.add('hidden');
        
        setTimeout(() => {
            document.getElementById('ai-report-skeleton').classList.add('hidden');
            document.getElementById('ai-report-content').classList.remove('hidden');
        }, 1500);
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
    }

    if (reportBtn) reportBtn.addEventListener('click', openModal);
    if (aiAssistantBtn) aiAssistantBtn.addEventListener('click', openModal);

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close on click outside
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
});
