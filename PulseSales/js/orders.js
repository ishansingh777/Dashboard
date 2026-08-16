// js/orders.js

function renderOrdersTable() {
    const tbody = document.getElementById('orders-tbody');
    const { orders } = window.store;
    if (!tbody || !orders) return;

    // Only render top 7 orders for the overview
    const displayOrders = orders.slice(0, 7);

    tbody.innerHTML = displayOrders.map(o => `
        <tr onclick="openOrderDrawer('${o.id}')">
            <td><strong>${o.id}</strong></td>
            <td>${o.customer}</td>
            <td>${o.product}</td>
            <td>${o.region}</td>
            <td class="text-right"><strong>${formatCurrency(o.amount)}</strong></td>
            <td><span class="status-pill ${o.status.toLowerCase()}">${o.status}</span></td>
            <td class="text-tertiary">${o.time}</td>
        </tr>
    `).join('');
}

function openOrderDrawer(orderId) {
    const { orders } = window.store;
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const overlay = document.getElementById('order-drawer-overlay');
    const drawer = document.getElementById('order-drawer');
    const title = document.getElementById('drawer-order-id');
    const content = document.getElementById('drawer-content');

    title.textContent = `Order ${order.id}`;

    content.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 24px;">
            <div>
                <p style="color: var(--text-secondary); font-size: 13px;">Customer</p>
                <p style="font-weight: 600; font-size: 15px;">${order.customer}</p>
            </div>
            
            <div>
                <p style="color: var(--text-secondary); font-size: 13px;">Product</p>
                <p style="font-weight: 500;">${order.product}</p>
            </div>
            
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <p style="color: var(--text-secondary); font-size: 13px;">Amount</p>
                    <p style="font-weight: 600; font-size: 18px;">${formatCurrency(order.amount)}</p>
                </div>
                <div>
                    <p style="color: var(--text-secondary); font-size: 13px;">Status</p>
                    <span class="status-pill ${order.status.toLowerCase()}" style="margin-top: 4px;">${order.status}</span>
                </div>
            </div>
            
            <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 8px 0;">
            
            <div>
                <p style="color: var(--text-secondary); font-size: 13px;">Shipping Details</p>
                <p style="font-size: 14px; margin-top: 4px;">Region: ${order.region}</p>
                <p style="font-size: 14px;">Date: ${order.time}</p>
            </div>
        </div>
    `;

    overlay.classList.add('active');
    drawer.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('order-drawer-overlay');
    const drawer = document.getElementById('order-drawer');
    const closeBtn = document.getElementById('close-drawer-btn');

    function closeDrawer() {
        if(overlay) overlay.classList.remove('active');
        if(drawer) drawer.classList.remove('active');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);
});
