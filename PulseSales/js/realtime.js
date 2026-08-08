// js/realtime.js

function setupRealtime() {
    if (!supabaseClient) return;

    supabaseClient
        .channel('public-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
            console.log('Realtime change received for orders!', payload);
            fetchSupabaseData().then(() => {
                if (typeof showToast === 'function') {
                    showToast('🔔 New Order Received', 'success');
                }
            });
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, payload => {
            console.log('Realtime change received for users!', payload);
            fetchSupabaseData().then(() => {
                if (typeof showToast === 'function') {
                    showToast('👤 New User Registered', 'success');
                }
            });
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
            console.log('Realtime change received for products!', payload);
            fetchSupabaseData().then(() => {
                if (typeof showToast === 'function') {
                    showToast('📦 Product Update', 'success');
                }
            });
        })
        .subscribe((status) => {
            console.log('Supabase Realtime status:', status);
            const debugRealtime = document.getElementById('debug-realtime');
            const debugRealtimeUI = document.getElementById('debug-realtime-ui');
            if (debugRealtime) {
                debugRealtime.textContent = status === 'SUBSCRIBED' ? 'CONNECTED' : status;
            }
            if (debugRealtimeUI) {
                debugRealtimeUI.textContent = status === 'SUBSCRIBED' ? 'Realtime Connected' : status;
                if (status === 'SUBSCRIBED') {
                    document.getElementById('connection-status').classList.remove('glow-amber');
                    document.getElementById('connection-status').classList.add('glow-green');
                } else {
                    document.getElementById('connection-status').classList.remove('glow-green');
                    document.getElementById('connection-status').classList.add('glow-amber');
                }
            }
        });
}
