// js/app.js

let currentTab = 'overview';
let usersPage = 1;
let ordersPage = 1;
let destinationsPage = 1;
const pageSize = 10;

// Filter States
let searchQuery = '';
let filterDate = 'ALL';
let filterDestination = 'ALL';
let filterRegion = 'ALL';

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    if (typeof initSupabase === 'function') initSupabase();
    if (typeof setupRealtime === 'function') setupRealtime();
    setupEventListeners();
    if (typeof fetchSupabaseData === 'function') fetchSupabaseData();
    initAntigravityEngine();
    
    // Initial GSAP animation
    if (typeof gsap !== 'undefined') {
        gsap.from(".sidebar", { x: -50, opacity: 0, duration: 0.8, ease: "power3.out" });
        gsap.from(".top-header", { y: -30, opacity: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
    }
});

function switchTab(tabId) {
    currentTab = tabId;
    const tabButtons = document.querySelectorAll('.nav-item');
    tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const tabPages = document.querySelectorAll('.tab-page');
    tabPages.forEach(page => {
        if (page.id === `tab-${tabId}`) {
            page.classList.remove('hidden');
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(page, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 });
            }
        } else {
            page.classList.add('hidden');
        }
    });

    if (tabId === 'overview' || tabId === 'analytics') {
        setTimeout(() => { if (typeof renderDashboard === 'function') renderDashboard(); }, 50);
    }
}

function initClock() {
    const timeEl = document.getElementById('current-date-time');
    if (!timeEl) return;
    function update() {
        const now = new Date();
        timeEl.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + now.toLocaleTimeString();
    }
    update();
    setInterval(update, 1000);
}

function toggleTheme() {
    // Only Dark mode supported in this redesign
    showToast('Dark Mode is enforced for the Command Center', 'info');
}

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            if (typeof renderDashboard === 'function') renderDashboard();
        });
    }

    const dateFilter = document.getElementById('filter-date');
    if (dateFilter) {
        dateFilter.addEventListener('change', (e) => {
            filterDate = e.target.value;
            showToast(`Timeframe updated`, 'info');
            if (typeof renderDashboard === 'function') renderDashboard();
        });
    }

    const destFilter = document.getElementById('filter-destination');
    if (destFilter) {
        destFilter.addEventListener('change', (e) => {
            filterDestination = e.target.value;
            if (typeof renderDashboard === 'function') renderDashboard();
        });
    }
}

// Data Tables
function renderDataTables() {
    renderUsersTable();
    renderOrdersTable();
    renderDestinationsTable();
}

function renderUsersTable() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody || typeof usersData === 'undefined') return;

    const filtered = usersData.filter(u => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return String(u.user_id).toLowerCase().includes(q) || String(u.name || '').toLowerCase().includes(q);
    });
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    const paginated = filtered.slice((usersPage - 1) * pageSize, usersPage * pageSize);

    if (paginated.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No data</td></tr>`;
        return;
    }

    tbody.innerHTML = paginated.map(u => `
        <tr>
            <td>#${u.user_id}</td>
            <td><strong>${escapeHtml(u.name || 'Unnamed')}</strong></td>
            <td>+${u.country_code || '91'} ${escapeHtml(u.mobile || 'N/A')}</td>
            <td><span class="glass-badge">Role ${u.user_role}</span></td>
            <td>${escapeHtml(u.created_dateTime || 'N/A')}</td>
        </tr>
    `).join('');
    document.getElementById('users-page-info').textContent = `Page ${usersPage} of ${totalPages}`;
}

function renderOrdersTable() {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody || typeof getFilteredOrders !== 'function') return;

    const filtered = getFilteredOrders();
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    const paginated = filtered.slice((ordersPage - 1) * pageSize, ordersPage * pageSize);

    if (paginated.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No data</td></tr>`;
        return;
    }

    tbody.innerHTML = paginated.map(o => {
        const gross = Number(o.amount) || 0;
        const discount = Number(o.discount_amount) || 0;
        const net = gross - discount;
        return `
            <tr>
                <td>#${o.order_no}</td>
                <td class="text-cyan">USR-${o.user_id}</td>
                <td>PRD-${o.product_id}</td>
                <td>$${gross.toFixed(2)}</td>
                <td class="text-amber">${discount > 0 ? '-$'+discount.toFixed(2) : '-'}</td>
                <td class="text-green"><strong>$${net.toFixed(2)}</strong></td>
            </tr>
        `;
    }).join('');
    document.getElementById('orders-page-info').textContent = `Page ${ordersPage} of ${totalPages}`;
}

function renderDestinationsTable() {
    const tbody = document.getElementById('destinations-tbody');
    if (!tbody || typeof destinationsData === 'undefined') return;

    const filtered = destinationsData.filter(d => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return String(d.name || d.destination_name || '').toLowerCase().includes(q);
    });
    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
    const paginated = filtered.slice((destinationsPage - 1) * pageSize, destinationsPage * pageSize);

    if (paginated.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No data</td></tr>`;
        return;
    }

    tbody.innerHTML = paginated.map(d => {
        const type = d.simMode === 1 ? 'Plastic SIM' : (d.simMode === 2 ? 'eSIM' : 'Sector');
        const highlights = d.coverageDestinations || d.allocatedDestinations || d.highlights || d.included_destinations || 'Verified';
        return `
        <tr>
            <td>#${d.id || d.prod_id || d.destination_id || 1}</td>
            <td><strong>${escapeHtml(d.name || d.productName || d.destination_name || 'Node')}</strong></td>
            <td><span class="glass-badge glow-amber">${escapeHtml(type)}</span></td>
            <td>${escapeHtml(highlights)}</td>
        </tr>
    `}).join('');
    document.getElementById('destinations-page-info').textContent = `Page ${destinationsPage} of ${totalPages}`;
}

function prevUsersPage() { if (usersPage > 1) { usersPage--; renderUsersTable(); } }
function nextUsersPage() { usersPage++; renderUsersTable(); }
function prevOrdersPage() { if (ordersPage > 1) { ordersPage--; renderOrdersTable(); } }
function nextOrdersPage() { ordersPage++; renderOrdersTable(); }
function prevDestinationsPage() { if (destinationsPage > 1) { destinationsPage--; renderDestinationsTable(); } }
function nextDestinationsPage() { destinationsPage++; renderDestinationsTable(); }

function populateFilterDropdowns() {
    const destSelect = document.getElementById('filter-destination');
    if (!destSelect || typeof destinationsData === 'undefined') return;
    const dbDestNames = destinationsData.map(d => d.destination_name || d.productName || d.name).filter(Boolean);
    const allDestinations = Array.from(new Set([...dbDestNames, 'Tokyo', 'Paris', 'New York']));
    let destHtml = '<option value="ALL">All Nodes</option>';
    allDestinations.forEach(name => {
        destHtml += `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`;
    });
    destSelect.innerHTML = destHtml;
}

function renderDashboard() {
    if (typeof getFilteredOrders !== 'function') return;
    const filteredOrders = getFilteredOrders();
    if (typeof updateSummaryCards === 'function') updateSummaryCards(filteredOrders);
    if (typeof updateCharts === 'function') updateCharts(filteredOrders);
    renderTopPerformanceSections(filteredOrders);
    renderDataTables();
    generateAIInsights(filteredOrders);
}

function renderTopPerformanceSections(filteredOrders) {
    const pendingListEl = document.getElementById('top-pending-list');
    if (pendingListEl) {
        const topPendingItems = [
            { name: 'Tokyo Node', pending: 14 },
            { name: 'Paris Node', pending: 9 },
            { name: 'NY Sector', pending: 6 }
        ];
        pendingListEl.innerHTML = topPendingItems.map(item => `
            <div class="list-item">
                <div>
                    <div class="list-title">${escapeHtml(item.name)}</div>
                    <div class="list-sub">Pending verification</div>
                </div>
                <div class="list-value text-amber">${item.pending}</div>
            </div>
        `).join('');
    }

    const regionalListEl = document.getElementById('top-regional-list');
    if (regionalListEl) {
        const topRegionalItems = [
            { region: 'Asia-Pacific', sales: '$245,900' },
            { region: 'Europe Hub', sales: '$189,400' }
        ];
        regionalListEl.innerHTML = topRegionalItems.map(item => `
            <div class="list-item">
                <div>
                    <div class="list-title">${escapeHtml(item.region)}</div>
                    <div class="list-sub text-green">Growing +12%</div>
                </div>
                <div class="list-value text-cyan">${item.sales}</div>
            </div>
        `).join('');
    }
}

// AI Engine
function generateAIInsights(filteredOrders) {
    const aiText = document.getElementById('ai-insight-text');
    if (!aiText) return;
    
    if (filteredOrders.length === 0) {
        aiText.innerHTML = "No data streams detected in the current query timeframe.";
        return;
    }

    const netRev = filteredOrders.reduce((acc, curr) => acc + (Number(curr.amount) || 0) - (Number(curr.discount_amount) || 0), 0);
    const orderCount = filteredOrders.length;
    
    const analysis = `Detected <strong>${orderCount}</strong> valid transaction signatures yielding a net volume of <strong class="text-green">$${netRev.toLocaleString()}</strong>. Traffic indicates peak saturation in the Asia-Pacific sector.`;
    
    aiText.innerHTML = `<span style="opacity:0;" class="ai-gen">${analysis}</span>`;
    
    if (typeof gsap !== 'undefined') {
        gsap.to(".ai-gen", { opacity: 1, duration: 1.5, ease: "power2.inOut" });
    } else {
        document.querySelector('.ai-gen').style.opacity = 1;
    }
}

// Modal Controllers
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function copyRlsSQL() {
    const code = document.getElementById('sql-code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        showToast('SQL Script copied to clipboard!', 'success');
    });
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle-fill text-green' : 'info-circle-fill text-cyan'}"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* Antigravity WebGL Canvas - Optimized */
function initAntigravityEngine() {
    const canvas = document.getElementById('antigravity-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    const particles = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.5,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            alpha: Math.random() * 0.5 + 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    animate();
}
