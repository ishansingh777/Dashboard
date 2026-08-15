// js/realtime.js

function setupMockRealtime() {
    setInterval(() => {
        if (!window.dashboardData || !window.dashboardData.orders) return;
        
        // Flash global live indicator
        const ind = document.getElementById('global-live-indicator');
        if (ind) {
            ind.classList.remove('hidden');
            setTimeout(() => {
                if (Math.random() > 0.5) ind.classList.add('hidden');
            }, 3000);
        }

        // Generate new random order
        const amt = (Math.random() * 500 + 50).toFixed(2);
        const orderId = `ORD-${Math.floor(Math.random() * 9000 + 1000)}`;
        const customers = ['Alex Morgan', 'Sarah Chen', 'Marcus Webb', 'Yuki Tanaka', 'James Wilson'];
        const regions = ['North America', 'Asia-Pacific', 'Europe', 'Other'];
        const products = ['Enterprise Cloud API', 'Pro Data Pipeline', 'Standard Analytics', 'Developer Seat'];
        
        const newOrder = {
            id: orderId,
            customer: customers[Math.floor(Math.random() * customers.length)],
            product: products[Math.floor(Math.random() * products.length)],
            region: regions[Math.floor(Math.random() * regions.length)],
            amount: parseFloat(amt),
            status: 'Processing',
            time: 'Just now'
        };

        // Add to data array (unshift)
        window.dashboardData.orders.unshift(newOrder);
        
        // Update Table UI
        const tbody = document.getElementById('live-orders-tbody');
        if (tbody) {
            const tr = document.createElement('tr');
            tr.className = 'new-row';
            tr.innerHTML = `
                <td class="order-id">${newOrder.id}</td>
                <td><strong>${newOrder.customer}</strong></td>
                <td>${newOrder.product}</td>
                <td>${newOrder.region}</td>
                <td class="amount">$${newOrder.amount.toFixed(2)}</td>
                <td><span class="status-pill ${newOrder.status.toLowerCase()}">${newOrder.status}</span></td>
                <td class="time">${newOrder.time}</td>
            `;
            tbody.insertBefore(tr, tbody.firstChild);
            
            // Remove last row to keep table size fixed
            if (tbody.children.length > 8) {
                tbody.removeChild(tbody.lastChild);
            }
        }

        // Show Toast
        if (typeof showToast === 'function') {
            showToast(`New order received — $${newOrder.amount.toFixed(2)}`, 'success');
        }

        // Slightly bump total revenue
        if (window.dashboardData.sales) {
            const m = window.dashboardData.sales.metrics;
            m.total_revenue += newOrder.amount;
            m.today_sales += newOrder.amount;
            m.total_orders += 1;
            
            const revEl = document.getElementById('total-revenue-val');
            if (revEl) revEl.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(m.total_revenue);
            
            const todayEl = document.getElementById('kpi-today-val');
            if (todayEl) todayEl.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(m.today_sales);
            
            const ordersEl = document.getElementById('kpi-orders-val');
            if (ordersEl) ordersEl.textContent = new Intl.NumberFormat('en-US').format(m.total_orders);
        }

    }, 8000); // Every 8 seconds
}
