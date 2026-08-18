// js/app.js

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Load Data
    if (typeof loadData === 'function') {
        const success = await loadData();
        if (success) {
            // 3. Initialize components
            if (typeof renderDashboard === 'function') renderDashboard();
            if (typeof renderOrdersTable === 'function') renderOrdersTable();
            if (typeof renderInsights === 'function') renderInsights();
            if (typeof renderActivityStream === 'function') renderActivityStream();
            if (typeof renderDeepInsightsFeed === 'function') renderDeepInsightsFeed();
            if (typeof initIntelCharts === 'function') initIntelCharts();
            
            // Render full tables
            if (typeof renderAnalyticsTable === 'function') renderAnalyticsTable();
            if (typeof renderFullOrdersTable === 'function') renderFullOrdersTable();
            if (typeof renderCustomersTable === 'function') renderCustomersTable();
            if (typeof renderProductsTable === 'function') renderProductsTable();
            if (typeof renderDestinationsTable === 'function') renderDestinationsTable();
            
            // Re-render icons if dynamically injected
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            // Add Date Picker Listener
            const dateInput = document.getElementById('global-date');
            if (dateInput) {
                dateInput.addEventListener('change', async (e) => {
                    const newDate = e.target.value;
                    const success = await loadData(newDate);
                    if (success) {
                        if (typeof renderDashboard === 'function') renderDashboard();
                        if (typeof renderOrdersTable === 'function') renderOrdersTable();
                        if (typeof renderInsights === 'function') renderInsights();
                        if (typeof renderActivityStream === 'function') renderActivityStream();
                        if (typeof renderDeepInsightsFeed === 'function') renderDeepInsightsFeed();
                        if (typeof initIntelCharts === 'function') initIntelCharts();
                        
                        // Render full tables
                        if (typeof renderAnalyticsTable === 'function') renderAnalyticsTable();
                        if (typeof renderFullOrdersTable === 'function') renderFullOrdersTable();
                        if (typeof renderCustomersTable === 'function') renderCustomersTable();
                        if (typeof renderProductsTable === 'function') renderProductsTable();
                        if (typeof renderDestinationsTable === 'function') renderDestinationsTable();
                        
                        if (typeof showToast === 'function') {
                            showToast(`Dashboard updated for ${newDate}`);
                        }
                    }
                });
            }
        } else {
            if (typeof showToast === 'function') {
                showToast('Unable to load sales data', 'error');
            }
        }
    }
});
