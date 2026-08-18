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
                            callback: function(val) { return formatCurrencyCompact(val); }
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

let intelInsightsChartInstance = null;
let forecastChartInstance = null;
let funnelChartInstance = null;

function initIntelCharts() {
    const colors = getChartColors();
    const isDark = document.body.classList.contains('dark-mode');
    
    // 1. Insights Donut
    const insightsCtx = document.getElementById('insights-donut-chart');
    if (insightsCtx) {
        if (intelInsightsChartInstance) intelInsightsChartInstance.destroy();
        const bgColors = isDark 
            ? ['#34D399', '#6366F1', '#FBBF24']
            : ['#10B981', '#4F46E5', '#F59E0B'];
            
        intelInsightsChartInstance = new Chart(insightsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Growth Opportunities', 'Neutral Observations', 'Risk Signals'],
                datasets: [{ data: [12, 8, 4], backgroundColor: bgColors, borderWidth: 0, cutout: '70%' }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: colors.text, font: { family: 'Inter', size: 12 }, padding: 20 } }
                }
            }
        });
    }

    // 2. Forecast Line Chart
    const forecastCtx = document.getElementById('forecast-chart');
    if (forecastCtx) {
        if (forecastChartInstance) forecastChartInstance.destroy();
        
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct (Proj)', 'Nov (Proj)', 'Dec (Proj)'];
        const historical = [120, 135, 125, 145, 160, 175, 170, 190, 210, null, null, null];
        const projected = [null, null, null, null, null, null, null, null, 210, 230, 260, 290];
        
        forecastChartInstance = new Chart(forecastCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Historical Revenue',
                        data: historical,
                        borderColor: colors.primary,
                        borderWidth: 3,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: colors.primary
                    },
                    {
                        label: 'Projected Revenue',
                        data: projected,
                        borderColor: isDark ? '#22D3EE' : '#06B6D4',
                        borderWidth: 3,
                        borderDash: [5, 5],
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: isDark ? '#22D3EE' : '#06B6D4'
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { color: colors.text, font: { family: 'Inter' } } },
                    tooltip: { 
                        mode: 'index', 
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + formatCurrencyCompact(context.parsed.y * 1000);
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: colors.text } },
                    y: { grid: { color: colors.grid, borderDash: [4, 4] }, ticks: { color: colors.text, callback: val => formatCurrencyCompact(val * 1000) } }
                }
            }
        });
    }

    // 3. Conversion Funnel (Bar chart styled as funnel)
    const funnelCtx = document.getElementById('funnel-chart');
    if (funnelCtx) {
        if (funnelChartInstance) funnelChartInstance.destroy();
        
        funnelChartInstance = new Chart(funnelCtx, {
            type: 'bar',
            data: {
                labels: ['Site Visitors', 'Added to Cart', 'Reached Checkout', 'Purchased'],
                datasets: [{
                    label: 'Users',
                    data: [15000, 4500, 2100, 1050],
                    backgroundColor: colors.primary,
                    borderRadius: 6,
                    barPercentage: 0.6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { display: false } },
                    y: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Inter', size: 13 } } }
                }
            }
        });
    }
}
