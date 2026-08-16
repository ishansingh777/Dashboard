// js/dashboard.js

function renderDashboard() {
    const { metrics, sales, products } = window.store;
    if (!metrics) return;

    // 1. Hero
    document.getElementById('hero-revenue-val').textContent = formatCurrency(metrics.revenue);
    document.getElementById('hero-revenue-trend').textContent = formatPercent(metrics.revenueGrowth);
    
    document.getElementById('hero-gross-val').textContent = formatCurrency(metrics.gross);
    document.getElementById('hero-discounts-val').textContent = `-${formatCurrency(metrics.discounts)}`;
    document.getElementById('hero-net-val').textContent = formatCurrency(metrics.revenue);
    document.getElementById('hero-aov-val').textContent = formatCurrency(metrics.aov);

    // 2. KPIs
    document.getElementById('kpi-orders-val').textContent = formatNumber(metrics.orders);
    document.getElementById('kpi-orders-trend').textContent = formatPercent(metrics.ordersGrowth);
    
    document.getElementById('kpi-customers-val').textContent = formatNumber(metrics.customers);
    document.getElementById('kpi-customers-trend').textContent = formatPercent(metrics.customersGrowth);
    
    document.getElementById('kpi-aov-val').textContent = formatCurrency(metrics.aov);
    document.getElementById('kpi-aov-trend').textContent = formatPercent(metrics.aovGrowth);
    
    document.getElementById('kpi-conv-val').textContent = `${metrics.conversion}%`;
    document.getElementById('kpi-conv-trend').textContent = formatPercent(metrics.conversionGrowth);

    // 3. Regional Performance
    renderRegionalList(sales.regional);

    // 4. Top Products
    renderTopProducts(products.slice(0, 5));
    
    // Create Charts
    if (typeof initCharts === 'function') {
        initCharts();
    }
}

function renderRegionalList(regions) {
    const container = document.getElementById('regional-list');
    if (!container || !regions) return;

    const data = [
        { name: 'North America', rev: regions.north_america, growth: 18.4, pct: 55 },
        { name: 'Europe', rev: regions.europe, growth: 8.2, pct: 25 },
        { name: 'Asia-Pacific', rev: regions.asia_pacific, growth: 22.1, pct: 15 },
        { name: 'Other', rev: regions.other, growth: -2.4, pct: 5 }
    ].sort((a, b) => b.rev - a.rev);

    container.innerHTML = data.map((r, i) => `
        <div class="list-row">
            <div class="list-col-left">
                <strong>${i + 1}. ${r.name}</strong>
                <span>${formatCurrency(r.rev)}</span>
            </div>
            <div class="list-col-right">
                <span class="${r.growth > 0 ? 'positive' : 'negative'}">${formatPercent(r.growth)}</span>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${r.pct}%"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderTopProducts(products) {
    const container = document.getElementById('products-list');
    if (!container || !products) return;

    container.innerHTML = products.map(p => `
        <div class="list-row">
            <div class="list-col-left">
                <strong>${p.name}</strong>
                <span>${p.category}</span>
            </div>
            <div class="list-col-right">
                <strong>${formatCurrency(p.price * Math.floor(Math.random() * 100 + 50))}</strong>
                <span class="positive">+${(Math.random() * 15 + 2).toFixed(1)}%</span>
            </div>
        </div>
    `).join('');
}

function renderAnalyticsTable() {
    const tbody = document.getElementById('analytics-page-tbody');
    const { sales } = window.store;
    if (!tbody || !sales || !sales.monthly_revenue) return;
    
    tbody.innerHTML = sales.monthly_revenue.map(d => `
        <tr>
            <td><strong>${d.month}</strong></td>
            <td class="text-right">${formatCurrency(d.revenue)}</td>
            <td>${formatNumber(d.orders)}</td>
            <td>${formatNumber(d.customers)}</td>
        </tr>
    `).join('');
}

function renderCustomersTable() {
    const tbody = document.getElementById('customers-page-tbody');
    const { customers } = window.store;
    if (!tbody || !customers) return;
    
    tbody.innerHTML = customers.map(c => `
        <tr>
            <td><strong>${c.id}</strong></td>
            <td><strong>${c.name}</strong></td>
            <td>${c.tier}</td>
            <td class="text-right">${formatCurrency(c.ltv)}</td>
            <td><span class="status-pill ${c.status === 'Active' ? 'completed' : 'cancelled'}">${c.status}</span></td>
        </tr>
    `).join('');
}

function renderProductsTable() {
    const tbody = document.getElementById('products-page-tbody');
    const { products } = window.store;
    if (!tbody || !products) return;
    
    tbody.innerHTML = products.map(p => `
        <tr>
            <td><strong>${p.id}</strong></td>
            <td><strong>${p.name}</strong></td>
            <td>${p.category}</td>
            <td class="text-right">${formatCurrency(p.price)}</td>
            <td>${p.stock}</td>
            <td><span class="status-pill ${p.status === 'Active' ? 'completed' : 'cancelled'}">${p.status}</span></td>
        </tr>
    `).join('');
}
