// js/supabase.js

const SUPABASE_URL ='https://xszcjscywohhsesyuecb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzemNqc2N5d29oaHNlc3l1ZWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NTM0ODYsImV4cCI6MjA5NzMyOTQ4Nn0.tYkhXt5iWIG0UdxwiU7lc_mFqiTYyLCNO5QQqhc0iiE';

let supabaseClient = null;

function initSupabase() {
    try {
        if (window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }
    } catch (e) {
        console.error('Supabase init error:', e);
    }
}
