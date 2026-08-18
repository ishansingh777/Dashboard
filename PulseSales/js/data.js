// js/data.js

window.store = {
    sales: null,
    orders: null,
    customers: null,
    products: null,
    destinations: null,
    
    // Calculated metrics
    metrics: {}
};

async function loadData(date = '2026-05-25') {
    try {
        const response = await fetch(`http://localhost:3000/api/dashboard?date=${date}`);
        const data = await response.json();

        window.store.sales = data.sales;
        window.store.orders = data.orders;
        window.store.customers = data.customers;
        window.store.products = data.products;
        window.store.destinations = data.destinations;

        calculateMetrics();
        return true;
    } catch (err) {
        console.error('Data loading error:', err);
        return false;
    }
}

function calculateMetrics() {
    // In a real app, this would process raw orders.
    // Here we extract from the sales.json structure while making it accessible.
    const m = window.store.sales.metrics;
    
    window.store.metrics = {
        revenue: m.total_revenue,
        revenueGrowth: m.revenue_growth,
        gross: m.gross_volume || m.total_revenue + 11073.95, // mock calculation
        discounts: m.discounts || 11073.95,
        aov: m.aov,
        aovGrowth: 4.8,
        
        orders: m.total_orders,
        ordersGrowth: m.orders_growth,
        
        customers: m.customers,
        customersGrowth: m.customers_growth,
        
        conversion: m.conversion_rate,
        conversionGrowth: m.conversion_growth
    };
}

// Utility formatters
const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
const formatNumber = (val) => new Intl.NumberFormat('en-US').format(val);
const formatPercent = (val) => `${val > 0 ? '+' : ''}${val}%`;
