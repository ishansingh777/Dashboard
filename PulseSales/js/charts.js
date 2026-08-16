// js/charts.js

let heroChartInstance = null;
let performanceChartInstance = null;
let breakdownChartInstance = null;

function getChartColors() {
    const isDark = document.body.classList.contains('dark-mode');
    return {
        text: isDark ? '#9CA3AF' : '#6B7280',
        grid: isDark ? '#1F2937' : '#E5E7EB',
        primary: isDark ? '#6366F1' : '#4F46E5',
        primaryBg: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.1)'
    };
}

function initCharts() {
    const colors = getChartColors();
    const { sales } = window.store;
    if (!sales) return;

    // 1. Hero Sparkline
    const heroCtx = document.getElementById('hero-revenue-chart');
    if (heroCtx) {
        if (heroChartInstance) heroChartInstance.destroy();
        
        const data = sales.weekly_revenue.map(d => d.value);
        heroChartInstance = new Chart(heroCtx, {
            type: 'line',
            data: {
                labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                datasets: [{
                    data: data,
                    borderColor: colors.primary,
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    fill: true,
                    backgroundColor: colors.primaryBg
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: true, mode: 'index', intersect: false } },
                scales: { x: { display: false }, y: { display: false } },
                interaction: { mode: 'index', intersect: false }
            }
        });
    }

    // 2. Performance Line Chart
    const perfCtx = document.getElementById('performance-chart');
    if (perfCtx) {
        if (performanceChartInstance) performanceChartInstance.destroy();
        
        performanceChartInstance = new Chart(perfCtx, {
            type: 'line',
            data: {
                labels: sales.monthly_revenue.map(d => d.month),
                datasets: [{
                    label: 'Revenue',
                    data: sales.monthly_revenue.map(d => d.revenue),
                    borderColor: colors.primary,
                    borderWidth: 2,
                    tension: 0.3,
                    pointBackgroundColor: colors.primary,
                    pointRadius: 0,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        titleFont: { family: 'Inter', size: 13 },
                        bodyFont: { family: 'Inter', size: 13 },
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false, drawBorder: false },
                        ticks: { color: colors.text, font: { family: 'Inter', size: 11 } }
                    },
                    y: {
                        grid: { color: colors.grid, drawBorder: false, borderDash: [4, 4] },
                        ticks: {
                            color: colors.text,
                            font: { family: 'Inter', size: 11 },
                            callback: function(val) { return '$' + (val / 1000) + 'k'; }
                        }
                    }
                },
                interaction: { mode: 'index', intersect: false }
            }
        });
    }

    // 3. Breakdown Donut Chart
    const breakCtx = document.getElementById('breakdown-chart');
    if (breakCtx) {
        if (breakdownChartInstance) breakdownChartInstance.destroy();
        
        const isDark = document.body.classList.contains('dark-mode');
        const bgColors = isDark 
            ? ['#6366F1', '#22D3EE', '#FBBF24', '#34D399', '#374151']
            : ['#4F46E5', '#06B6D4', '#F59E0B', '#10B981', '#E5E7EB'];
            
        const labels = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Other'];
        const values = [45, 25, 15, 10, 5]; // percentages
        
        breakdownChartInstance = new Chart(breakCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: bgColors,
                    borderWidth: 0,
                    cutout: '75%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
        
        // Render custom legend
        const legendContainer = document.getElementById('breakdown-legend');
        if (legendContainer) {
            legendContainer.innerHTML = labels.map((label, i) => `
                <div class="legend-item">
                    <div class="label">
                        <span class="dot" style="background-color: ${bgColors[i]}"></span>
                        ${label}
                    </div>
                    <span class="val">${values[i]}%</span>
                </div>
            `).join('');
        }
    }
}

// Re-init on theme change
document.addEventListener('themeChanged', () => {
    if (window.store && window.store.sales) {
        initCharts();
    }
});
