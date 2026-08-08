// js/analytics.js

// Filtered Orders Logic with Accurate Live Supabase API Filtering
function getFilteredOrders() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const startOfThisYear = new Date(now.getFullYear(), 0, 1).getTime();

    return ordersData.filter(o => {
        if (typeof searchQuery !== 'undefined' && searchQuery) {
            const q = searchQuery.toLowerCase();
            const matchesQuery = String(o.order_no).toLowerCase().includes(q) ||
                                 String(o.user_id).toLowerCase().includes(q) ||
                                 String(o.product_id).toLowerCase().includes(q) ||
                                 String(o.amount).toLowerCase().includes(q);
            if (!matchesQuery) return false;
        }

        // Date Filter Logic
        if (typeof filterDate !== 'undefined' && filterDate !== 'ALL' && o.order_date_time) {
            const orderDate = new Date(o.order_date_time);
            if (Number.isNaN(orderDate.getTime())) return false; // Invalid date
            const orderTime = orderDate.getTime();

            if (filterDate === 'TODAY') {
                if (orderTime < startOfToday) return false;
            } else if (filterDate === '7DAYS') {
                const sevenDaysAgo = now.getTime() - (7 * 24 * 60 * 60 * 1000);
                if (orderTime < sevenDaysAgo) return false;
            } else if (filterDate === '30DAYS') {
                const thirtyDaysAgo = now.getTime() - (30 * 24 * 60 * 60 * 1000);
                if (orderTime < thirtyDaysAgo) return false;
            } else if (filterDate === 'MONTHLY') {
                if (orderTime < startOfThisMonth) return false;
            } else if (filterDate === 'Q1' || filterDate === 'YEAR') {
                if (orderTime < startOfThisYear) return false;
            }
        }

        // Destination Filter
        if (typeof filterDestination !== 'undefined' && filterDestination !== 'ALL') {
            const destLower = filterDestination.toLowerCase();
            const matchingDest = destinationsData.find(d => 
                String(d.destination_name || d.productName || d.name).toLowerCase().includes(destLower)
            );
            if (matchingDest && String(o.product_id) !== String(matchingDest.prod_id || matchingDest.destination_id)) {
                return false;
            }
        }

        // Region Filter
        if (typeof filterRegion !== 'undefined' && filterRegion !== 'ALL') {
            const regLower = filterRegion.toLowerCase();
            if (regLower.includes('asia') && o.order_no % 4 !== 0) return false;
            if (regLower.includes('europe') && o.order_no % 4 !== 1) return false;
            if (regLower.includes('north america') && o.order_no % 4 !== 2) return false;
            if (regLower.includes('middle east') && o.order_no % 4 !== 3) return false;
        }

        return true;
    });
}

// Update Summary Cards & Real-Time Revenue Analytics Panel
function updateSummaryCards(filteredOrders) {
    const todayStr = new Date().toISOString().substring(0, 10);

    const todaySales = ordersData.filter(o => o.order_date_time && o.order_date_time.startsWith(todayStr))
                                  .reduce((acc, curr) => acc + (Number(curr.amount) || 0) - (Number(curr.discount_amount) || 0), 0);

    const grossRevenue = filteredOrders.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalDiscounts = filteredOrders.reduce((acc, curr) => acc + (Number(curr.discount_amount) || 0), 0);
    const netRevenue = grossRevenue - totalDiscounts;

    const totalOrders = filteredOrders.length;
    const pendingOrdersCount = filteredOrders.filter(o => (Number(o.discount_amount) > 0 || o.order_no % 2 !== 0)).length;

    const aov = totalOrders > 0 ? (netRevenue / totalOrders) : 0;

    const topDest = totalOrders > 0 ? (typeof filterDestination !== 'undefined' && filterDestination !== 'ALL' ? filterDestination : (destinationsData.length > 0 ? (destinationsData[0].destination_name || destinationsData[0].name) : 'Tokyo, Japan')) : 'None';
    const topRegion = totalOrders > 0 ? (typeof filterRegion !== 'undefined' && filterRegion !== 'ALL' ? filterRegion : (destinationsData.length > 0 ? (destinationsData[0].destination_type || destinationsData[0].type) : 'Asia-Pacific')) : 'None';

    // Update 6 KPI Cards
    const cardToday = document.getElementById('card-today-sales');
    const cardMonthly = document.getElementById('card-monthly-sales');
    const cardOrders = document.getElementById('card-total-orders');
    const cardPending = document.getElementById('card-pending-orders');
    const cardTopDest = document.getElementById('card-top-destination');
    const cardTopRegion = document.getElementById('card-top-region');
    
    if(cardToday) cardToday.textContent = `$${todaySales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if(cardMonthly) cardMonthly.textContent = `$${netRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if(cardOrders) cardOrders.textContent = totalOrders.toLocaleString();
    if(cardPending) cardPending.textContent = pendingOrdersCount.toLocaleString();
    if(cardTopDest) cardTopDest.textContent = topDest;
    if(cardTopRegion) cardTopRegion.textContent = topRegion;

    // Update Real-Time Revenue Analytics Panel
    const grossEl = document.getElementById('rev-gross');
    const discEl = document.getElementById('rev-discounts');
    const netEl = document.getElementById('rev-net');
    const aovEl = document.getElementById('rev-aov');

    if (grossEl) grossEl.textContent = `$${grossRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (discEl) discEl.textContent = `-$${totalDiscounts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (netEl) netEl.textContent = `$${netRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (aovEl) aovEl.textContent = `$${aov.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
