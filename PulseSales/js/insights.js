// js/insights.js

function renderInsights() {
    const container = document.getElementById('insights-container');
    const { metrics, sales } = window.store;
    if (!container || !metrics) return;

    // Dynamically generate insights based on data
    const insights = [];

    // Insight 1: Revenue
    if (metrics.revenueGrowth > 10) {
        insights.push({
            type: 'green',
            icon: 'trending-up',
            title: 'Revenue acceleration',
            desc: `Revenue grew by ${metrics.revenueGrowth}% this period, outperforming the rolling average.`,
            time: 'Just now'
        });
    }

    // Insight 2: Region
    const topRegion = Object.keys(sales.regional).reduce((a, b) => sales.regional[a] > sales.regional[b] ? a : b);
    const regionName = topRegion.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    insights.push({
        type: 'blue',
        icon: 'globe',
        title: 'Regional strength',
        desc: `${regionName} is currently the top performing region, driving over 50% of gross volume.`,
        time: '2 hours ago'
    });

    // Insight 3: Risk / Alert (Mocking a pending order alert)
    insights.push({
        type: 'amber',
        icon: 'alert-circle',
        title: 'Fulfillment delay',
        desc: 'Pending orders have increased by 7.2% in the last 24 hours. Check fulfillment queue.',
        time: '5 hours ago'
    });

    container.innerHTML = insights.map(ins => `
        <div class="insight-item">
            <div class="insight-icon ${ins.type}">
                <i data-lucide="${ins.icon}"></i>
            </div>
            <div class="insight-content">
                <h4>${ins.title}</h4>
                <p>${ins.desc}</p>
                <span class="insight-time">${ins.time}</span>
            </div>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderActivityStream() {
    const stream = document.getElementById('activity-stream');
    const { orders } = window.store;
    if (!stream || !orders) return;

    // Generate recent activity from orders
    const activities = orders.slice(0, 4).map(o => {
        let action = o.status === 'Completed' ? 'completed payment' : 'placed an order';
        return {
            time: o.time.split(' ')[1] || '14:00', // Extract time
            text: `<strong>${o.customer}</strong> ${action} for <strong>${formatCurrency(o.amount)}</strong>`
        };
    });

    stream.innerHTML = activities.map(act => `
        <div class="activity-item">
            <span class="activity-time">${act.time}</span>
            <div class="activity-text">${act.text}</div>
        </div>
    `).join('');
}

function renderDeepInsightsFeed() {
    const container = document.getElementById('deep-insights-feed');
    if (!container) return;

    const insights = [
        { type: 'green', icon: 'trending-up', title: 'Revenue acceleration', desc: 'Revenue grew by 12.8% this period, outperforming the rolling average.', time: 'Just now' },
        { type: 'blue', icon: 'globe', title: 'Regional strength', desc: 'North America is currently the top performing region, driving over 50% of gross volume.', time: '2 hours ago' },
        { type: 'amber', icon: 'alert-circle', title: 'Fulfillment delay', desc: 'Pending orders have increased by 7.2% in the last 24 hours. Check fulfillment queue.', time: '5 hours ago' },
        { type: 'blue', icon: 'users', title: 'Customer retention', desc: 'Repeat purchase rate is up 4% compared to last quarter.', time: '1 day ago' },
        { type: 'amber', icon: 'shopping-bag', title: 'Low stock warning', desc: 'Wireless Earbuds Pro are projected to run out of stock in 4 days.', time: '1 day ago' },
        { type: 'green', icon: 'mouse-pointer', title: 'Conversion spike', desc: 'Checkout conversion rate spiked to 9.1% during the weekend sale.', time: '2 days ago' }
    ];

    container.innerHTML = insights.map(ins => `
        <div class="insight-item">
            <div class="insight-icon ${ins.type}">
                <i data-lucide="${ins.icon}"></i>
            </div>
            <div class="insight-content">
                <h4>${ins.title}</h4>
                <p>${ins.desc}</p>
                <span class="insight-time">${ins.time}</span>
            </div>
        </div>
    `).join('');
}
