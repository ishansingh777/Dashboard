// js/dashboard.js

window.dashboardData = {
    sales: null,
    orders: null,
    customers: null
};

async function loadDashboardData() {
    try {
        const [salesRes, ordersRes, customersRes] = await Promise.all([
            fetch('data/sales.json'),
            fetch('data/orders.json'),
            fetch('data/customers.json')
        ]);

        window.dashboardData.sales = await salesRes.json();
        window.dashboardData.orders = await ordersRes.json();
        window.dashboardData.customers = await customersRes.json();

        populateUI();
        if (typeof initCharts === 'function') initCharts(window.dashboardData.sales);
    } catch (err) {
        console.error('Error loading mock data:', err);
        showToast('Error loading dashboard data', 'error');
    }
}

function formatCurrency(val) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
}

function formatNumber(val) {
    return new Intl.NumberFormat('en-US').format(val);
}

function populateUI() {
    const { sales, orders } = window.dashboardData;
    if (!sales) return;

    const m = sales.metrics;
    
    // Hero Section
    document.getElementById('total-revenue-val').textContent = formatCurrency(m.total_revenue);
    document.getElementById('total-revenue-trend').innerHTML = `<i data-lucide="trending-up"></i> +${m.revenue_growth}% vs previous period`;
    
    document.getElementById('gross-volume-val').textContent = formatCurrency(m.gross_volume);
    document.getElementById('discounts-val').textContent = `-${formatCurrency(m.discounts)}`;
    document.getElementById('aov-val').textContent = formatCurrency(m.aov);

    // KPI Grid
    document.getElementById('kpi-today-val').textContent = formatCurrency(m.today_sales);
    document.getElementById('kpi-today-trend').textContent = `+${m.today_growth}%`;
    
    document.getElementById('kpi-month-val').textContent = formatCurrency(m.total_revenue);
    document.getElementById('kpi-month-trend').textContent = `+${m.revenue_growth}%`;
    
    document.getElementById('kpi-orders-val').textContent = formatNumber(m.total_orders);
    document.getElementById('kpi-orders-trend').textContent = `+${m.orders_growth}%`;
    
    document.getElementById('kpi-pending-val').textContent = formatNumber(m.pending_orders);
    document.getElementById('kpi-pending-trend').textContent = `${m.pending_growth}%`;
    
    document.getElementById('kpi-customers-val').textContent = formatNumber(m.customers);
    document.getElementById('kpi-customers-trend').textContent = `+${m.customers_growth}%`;
    
    document.getElementById('kpi-conversion-val').textContent = `${m.conversion_rate}%`;
    document.getElementById('kpi-conversion-trend').textContent = `+${m.conversion_growth}%`;

    // Map Stats
    const r = sales.regional;
    document.getElementById('map-na').textContent = formatCurrency(r.north_america).split('.')[0];
    document.getElementById('map-eu').textContent = formatCurrency(r.europe).split('.')[0];
    document.getElementById('map-ap').textContent = formatCurrency(r.asia_pacific).split('.')[0];
    document.getElementById('map-other').textContent = formatCurrency(r.other).split('.')[0];

    // Re-init icons for dynamic content
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Render Orders Table
    renderOrdersTable(orders);
    
    // Render Hero Sparkline
    renderHeroSparkline(sales.weekly_revenue.map(d => d.value));
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('live-orders-tbody');
    if (!tbody || !orders) return;

    tbody.innerHTML = orders.slice(0, 8).map(o => `
        <tr>
            <td class="order-id">${o.id}</td>
            <td><strong>${o.customer}</strong></td>
            <td>${o.product}</td>
            <td>${o.region}</td>
            <td class="amount">${formatCurrency(o.amount)}</td>
            <td><span class="status-pill ${o.status.toLowerCase()}">${o.status}</span></td>
            <td class="time">${o.time}</td>
        </tr>
    `).join('');
}

function renderHeroSparkline(data) {
    const ctx = document.getElementById('hero-sparkline');
    if (!ctx) return;
    
    const isDark = document.body.classList.contains('dark-mode');
    const color = isDark ? '#6366f1' : '#4f46e5';

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1', '2', '3', '4', '5', '6', '7'],
            datasets: [{
                data: data,
                borderColor: color,
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } },
            interaction: { intersect: false, mode: 'index' }
        }
    });
}
