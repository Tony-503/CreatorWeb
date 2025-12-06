

import { createClient } from '@supabase/supabase-js';

const URL = 'https://pnlweszbuifrkbnoplbt.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBubHdlc3pidWlmcmtibm9wbGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTY3NTUsImV4cCI6MjA3OTE3Mjc1NX0.6IZ0-PZXMq3tVYuOKsta84JgbBDSYcd6F5ORr9Uvm-g';

const supabase = createClient(URL, API_KEY);
export default supabase;
export { supabase };