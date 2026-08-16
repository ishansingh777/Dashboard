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

async function loadData() {
    try {
        const [salesRes, ordersRes, customersRes, productsRes, destinationsRes] = await Promise.all([
            fetch('data/sales.json'),
            fetch('data/orders.json'),
            fetch('data/customers.json'),
            fetch('data/products.json'),
            fetch('data/destinations.json')
        ]);

        window.store.sales = await salesRes.json();
        window.store.orders = await ordersRes.json();
        window.store.customers = await customersRes.json();
        window.store.products = await productsRes.json();
        window.store.destinations = await destinationsRes.json();

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
