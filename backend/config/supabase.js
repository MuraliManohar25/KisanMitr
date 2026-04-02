import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../.env');

dotenv.config({ path: envPath });

const supabaseUrl = process.env.SUPABASE_URL || 'https://tqopuaavwcyugmnhkmuq.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const hasValidKey = supabaseKey && supabaseKey.startsWith('eyJ');

if (!hasValidKey) {
  console.log('📴 OFFLINE MODE: Using in-memory database (no valid Supabase key)');
} else {
  console.log('✅ Supabase configuration loaded');
  console.log('   URL:', supabaseUrl);
}

// ── In-memory storage for offline mode ───────────────────────────────────────

export const memoryDB = {
  users: new Map(),
  analyses: new Map(),
  analysis_items: new Map(),
  certificates: new Map(),
  training_images: new Map()
};

const generateId = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

// Async init — no top-level await
const initDemoUser = async () => {
  const demoPasswordHash = await bcrypt.hash('demo123', 10);
  const demoUser = {
    id: 'demo-user-001',
    username: 'demo',
    email: 'demo@kisanmitra.com',
    password_hash: demoPasswordHash,
    farmer_name: 'Demo Farmer',
    location: 'India',
    phone: '+91 98765 43210',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  memoryDB.users.set(demoUser.id, demoUser);
};

initDemoUser().catch(console.error);

// ── Mock Supabase client ──────────────────────────────────────────────────────

const createMockClient = () => {
  const getTable = (table) => Array.from(memoryDB[table]?.values() || []);

  const buildQuery = (table, rows) => {
    let _rows = [...rows];
    let _filters = [];
    let _orderColumn = null;
    let _orderAsc = true;
    let _limit = null;
    let _single = false;

    const applyFilters = () => {
      let result = [..._rows];
      for (const { col, val } of _filters) {
        result = result.filter(r => r[col] === val);
      }
      if (_orderColumn) {
        result.sort((a, b) => {
          if (a[_orderColumn] < b[_orderColumn]) return _orderAsc ? -1 : 1;
          if (a[_orderColumn] > b[_orderColumn]) return _orderAsc ? 1 : -1;
          return 0;
        });
      }
      if (_limit !== null) result = result.slice(0, _limit);
      return result;
    };

    const executeQuery = () => {
      const result = applyFilters();
      if (_single) {
        const row = result[0] || null;
        return Promise.resolve({
          data: row,
          error: row ? null : { code: 'PGRST116', message: 'Not found' }
        });
      }
      return Promise.resolve({ data: result, error: null });
    };

    const chain = {
      eq: (col, val) => { _filters.push({ col, val }); return chain; },
      order: (col, opts = {}) => {
        _orderColumn = col;
        _orderAsc = opts.ascending !== false;
        return chain;
      },
      limit: (n) => { _limit = n; return executeQuery(); },
      single: () => { _single = true; return executeQuery(); },
      then: (onFulfilled, onRejected) =>
        Promise.resolve({ data: applyFilters(), error: null }).then(onFulfilled, onRejected)
    };

    return chain;
  };

  return {
    from: (table) => ({
      select: (columns = '*') => {
        const rows = getTable(table);
        return buildQuery(table, rows);
      },

      insert: (data) => {
        const isArray = Array.isArray(data);
        const items = isArray ? data : [data];
        const inserted = items.map(item => {
          const newItem = {
            ...item,
            id: item.id || generateId(),
            created_at: item.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          memoryDB[table]?.set(newItem.id, newItem);
          return newItem;
        });

        return {
          select: (columns = '*') => buildQuery(table, inserted),
          then: (onFulfilled, onRejected) =>
            Promise.resolve({ data: inserted, error: null }).then(onFulfilled, onRejected)
        };
      },

      update: (data) => ({
        eq: (col, val) => {
          const rows = getTable(table);
          const row = rows.find(r => r[col] === val);
          if (row) {
            const updated = { ...row, ...data, updated_at: new Date().toISOString() };
            memoryDB[table]?.set(updated.id, updated);
            return Promise.resolve({ data: [updated], error: null });
          }
          return Promise.resolve({ data: null, error: { message: 'Not found' } });
        }
      }),

      delete: () => ({
        eq: (col, val) => {
          const rows = getTable(table);
          const row = rows.find(r => r[col] === val);
          if (row) memoryDB[table]?.delete(row.id);
          return Promise.resolve({ error: null });
        }
      })
    }),

    auth: {
      signUp: () => Promise.resolve({ data: null, error: null }),
      signInWithPassword: () => Promise.resolve({ data: null, error: null })
    },

    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: { path: 'mock-path' }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'http://localhost/mock' } })
      })
    },

    _memoryDB: memoryDB
  };
};

// ── Export ────────────────────────────────────────────────────────────────────

const supabase = hasValidKey
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
  : createMockClient();

export { supabase };
export default supabase;
