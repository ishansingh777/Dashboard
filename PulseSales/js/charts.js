// js/charts.js

let mainRevenueChart = null;
let salesBarChart = null;
let regionDonutChart = null;

function getChartColors() {
    const isDark = document.body.classList.contains('dark-mode');
    return {
        text: isDark ? '#94a3b8' : '#475569',
        grid: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
        indigo: isDark ? '#6366f1' : '#4f46e5',
        indigoLight: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(79, 70, 229, 0.1)',
        cyan: '#06b6d4',
        amber: '#f59e0b',
        green: '#10b981',
        tooltipBg: isDark ? 'rgba(16, 21, 34, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        tooltipText: isDark ? '#f8fafc' : '#0f172a'
    };
}

function initCharts(salesData) {
    if (!salesData) return;
    
    Chart.defaults.font.family = "'Inter', sans-serif";
    
    renderMainRevenueChart(salesData.monthly_revenue);
    renderSalesBarChart(salesData.weekly_revenue);
    renderRegionDonutChart(salesData.regional);
}

function getCommonOptions() {
    const colors = getChartColors();
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: colors.tooltipBg,
                titleColor: colors.tooltipText,
                bodyColor: colors.tooltipText,
                borderColor: colors.grid,
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                cornerRadius: 8,
                titleFont: { size: 13, family: "'Inter', sans-serif" },
                bodyFont: { size: 12, family: "'Inter', sans-serif" }
            }
        },
        interaction: { mode: 'index', intersect: false }
    };
}

function renderMainRevenueChart(monthlyData) {
    const ctx = document.getElementById('main-revenue-chart');
    if (!ctx) return;
    if (mainRevenueChart) mainRevenueChart.destroy();
    
    const colors = getChartColors();
    const labels = monthlyData.map(d => d.month);
    const data = monthlyData.map(d => d.revenue);

    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 350);
    gradient.addColorStop(0, colors.indigoLight);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    const opts = getCommonOptions();
    opts.scales = {
        x: { grid: { display: false }, ticks: { color: colors.text } },
        y: { grid: { color: colors.grid }, ticks: { color: colors.text, callback: val => '$' + val / 1000 + 'k' } }
    };

    mainRevenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Net Revenue',
                data,
                borderColor: colors.indigo,
                backgroundColor: gradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: colors.indigo,
                pointBorderColor: '#fff',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: opts
    });
}

function renderSalesBarChart(weeklyData) {
    const ctx = document.getElementById('sales-bar-chart');
    if (!ctx) return;
    if (salesBarChart) salesBarChart.destroy();

    const colors = getChartColors();
    const labels = weeklyData.map(d => d.day);
    const data = weeklyData.map(d => d.value);

    const opts = getCommonOptions();
    opts.scales = {
        x: { grid: { display: false }, ticks: { color: colors.text } },
        y: { grid: { color: colors.grid }, ticks: { color: colors.text, callback: val => '$' + val / 1000 + 'k' } }
    };

    salesBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Sales',
                data,
                backgroundColor: colors.cyan,
                borderRadius: 4,
                barPercentage: 0.6
            }]
        },
        options: opts
    });
}

function renderRegionDonutChart(regionalData) {
    const ctx = document.getElementById('region-donut-chart');
    if (!ctx) return;
    if (regionDonutChart) regionDonutChart.destroy();

    const colors = getChartColors();
    const labels = ['North America', 'Europe', 'Asia-Pacific', 'Other'];
    const data = [
        regionalData.north_america,
        regionalData.europe,
        regionalData.asia_pacific,
        regionalData.other
    ];

    regionDonutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: [colors.indigo, colors.cyan, colors.amber, colors.green],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { position: 'right', labels: { color: colors.text, padding: 20, font: { family: "'Inter', sans-serif" } } },
                tooltip: getCommonOptions().plugins.tooltip
            }
        }
    });
}

// Redraw on theme change
window.addEventListener('themeChanged', () => {
    if (window.dashboardData && window.dashboardData.sales) {
        initCharts(window.dashboardData.sales);
    }
});
