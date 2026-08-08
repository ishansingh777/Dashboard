// js/database.js

// Raw API State Data (Connected directly to Supabase)
let usersData = [];
let ordersData = [];
let destinationsData = [];

// Fetch 100% directly from 3 Supabase API tables
async function fetchSupabaseData() {
    if (!supabaseClient) return;

    try {
        const { data: uData, error: uErr } = await supabaseClient.from('users').select('*');
        if (uData && uData.length > 0) usersData = uData;
        if (uErr) console.error('Supabase users error:', uErr);

        const { data: oData, error: oErr } = await supabaseClient.from('orders').select('*');
        if (oData && oData.length > 0) ordersData = oData;
        if (oErr) console.error('Supabase orders error:', oErr);

        const { data: dData, error: dErr } = await supabaseClient.from('products').select('*');
        if (dData && dData.length > 0) destinationsData = dData;
        if (dErr) console.error('Supabase products error:', dErr);

        // Update Debug Panel
        const debugConn = document.getElementById('debug-conn');
        const debugOrders = document.getElementById('debug-orders');
        const debugUsers = document.getElementById('debug-users');
        const debugProducts = document.getElementById('debug-products');
        const debugSync = document.getElementById('debug-sync');
        
        if (debugConn) debugConn.textContent = (uErr && oErr) ? 'ERROR' : 'YES';
        if (debugOrders) debugOrders.textContent = (oErr ? oErr.message : ordersData.length);
        if (debugUsers) debugUsers.textContent = (uErr ? uErr.message : usersData.length);
        if (debugProducts) debugProducts.textContent = (dErr ? dErr.message : destinationsData.length);
        if (debugSync) debugSync.textContent = new Date().toLocaleTimeString();

        // Check connection banner
        const banner = document.getElementById('rls-banner');
        if (banner) banner.style.display = (usersData.length === 0 && ordersData.length === 0) ? 'flex' : 'none';

        if (typeof populateFilterDropdowns === 'function') populateFilterDropdowns();
        if (typeof renderDashboard === 'function') renderDashboard();

        if (typeof showToast === 'function') {
            showToast(`⚡ Supabase API Live! Synced ${ordersData.length} orders & ${usersData.length} users.`, 'success');
        }
    } catch (err) {
        console.error('Supabase API fetch error:', err);
        const debugConn = document.getElementById('debug-conn');
        if (debugConn) debugConn.textContent = 'ERROR: ' + err.message;
    }
}
