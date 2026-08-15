// js/charts.js

// Global Chart Instances
let revenueLineChart = null;
let destinationBarChart = null;
let regionDoughnutChart = null;
let velocityAreaChart = null;
let pendingChart = null;

// Premium Chart.js Defaults
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Space Grotesk', monospace";

const premiumOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#818cf8',
            bodyColor: '#fff',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            boxPadding: 6,
            cornerRadius: 8
        }
    },
    scales: {
        x: { grid: { display: false, drawBorder: false }, ticks: { color: '#64748b' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.03)', drawBorder: false }, ticks: { color: '#64748b' } }
    },
    interaction: {
        mode: 'index',
        intersect: false,
    }
};

function renderLineChart(labels, data) {
    const ctx = document.getElementById('lineChart');
    if (!ctx) return;
    
    if (revenueLineChart) revenueLineChart.destroy();
    
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    revenueLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Net Revenue ($)',
                data: data,
                borderColor: '#818cf8',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#0f172a',
                pointBorderColor: '#22d3ee',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: premiumOptions
    });
}

function renderBarChart(labels, data) {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;
    
    if (destinationBarChart) destinationBarChart.destroy();
    
    destinationBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gross Volume',
                data: data,
                backgroundColor: 'rgba(6, 182, 212, 0.8)',
                hoverBackgroundColor: '#22d3ee',
                borderRadius: 6,
                barPercentage: 0.6
            }]
        },
        options: premiumOptions
    });
}

function renderDoughnutChart(labels, data) {
    const ctx = document.getElementById('doughnutChart');
    if (!ctx) return;
    
    if (regionDoughnutChart) regionDoughnutChart.destroy();
    
    regionDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#818cf8', // Indigo
                    '#22d3ee', // Cyan
                    '#f472b6', // Pink
                    '#fbbf24'  // Amber
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#cbd5e1', padding: 20, font: { family: "'Space Grotesk', monospace" } }
                },
                tooltip: premiumOptions.plugins.tooltip
            }
        }
    });
}

// Extra Charts for Analytics Dashboard Tab
function updateCharts(filteredOrders) {
    // Shared processing
    const dateMap = {};
    const destNames = ['Tokyo', 'Paris', 'New York', 'Swiss Alps', 'Dubai', 'Sydney'];
    const destMap = {};
    destNames.forEach(d => destMap[d] = 0);

    const regions = ['Asia-Pacific', 'Europe', 'North America', 'Middle East'];
    const regionMap = {};
    regions.forEach(r => regionMap[r] = 0);

    // Process data
    if (filteredOrders && filteredOrders.length > 0) {
        filteredOrders.forEach((o, i) => {
            // Line chart (Date wise)
            if (o.order_date_time) {
                const d = new Date(o.order_date_time);
                if (!isNaN(d.getTime())) {
                    const dateStr = d.toLocaleDateString();
                    if (!dateMap[dateStr]) dateMap[dateStr] = 0;
                    dateMap[dateStr] += ((Number(o.amount) || 0) - (Number(o.discount_amount) || 0));
                }
            }
            
            // Bar chart
            const dIdx = (o.product_id || 0) % destNames.length;
            destMap[destNames[dIdx]] += (Number(o.amount) || 0);
            
            // Doughnut
            const rIdx = i % regions.length;
            regionMap[regions[rIdx]] += 1;
        });
    }

    // Sort dates for line chart
    const sortedDates = Object.keys(dateMap).sort((a, b) => new Date(a) - new Date(b));
    const sortedData = sortedDates.map(d => dateMap[d]);

    renderLineChart(sortedDates, sortedData);
    renderBarChart(Object.keys(destMap), Object.values(destMap));
    renderDoughnutChart(Object.keys(regionMap), Object.values(regionMap));
    
    // Velocity Area Chart (Analytics Tab)
    const ctxArea = document.getElementById('areaChart');
    if (ctxArea) {
        if (velocityAreaChart) velocityAreaChart.destroy();
        velocityAreaChart = new Chart(ctxArea, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Velocity',
                    data: [12, 19, 15, 25, 22, 30, 28],
                    borderColor: '#a855f7',
                    backgroundColor: 'rgba(168, 85, 247, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: premiumOptions
        });
    }

    // Pending Chart (Analytics Tab)
    const ctxPending = document.getElementById('pendingChart');
    if (ctxPending) {
        if (pendingChart) pendingChart.destroy();
        pendingChart = new Chart(ctxPending, {
            type: 'bar',
            data: {
                labels: ['Processed', 'Pending', 'Failed'],
                datasets: [{
                    label: 'Status',
                    data: [85, 12, 3],
                    backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
                    borderRadius: 4
                }]
            },
            options: premiumOptions
        });
    }
}
