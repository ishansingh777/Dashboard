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
