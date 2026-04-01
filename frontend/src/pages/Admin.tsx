import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Database } from 'lucide-react';

export default function Admin() {
  const [stats, setStats] = useState({ total: 0, today: 0, gradeA: 0, gradeB: 0 });

  useEffect(() => {
    // Fetch admin stats (mock for now)
    // In production, this would call an admin API endpoint
    setStats({ total: 0, today: 0, gradeA: 0, gradeB: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="bg-forest text-white py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-leaf rounded-lg transition">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-heading text-xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-farmer">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-8 h-8 text-forest" />
              <h2 className="font-heading text-xl font-bold text-forest">Total Analyses</h2>
            </div>
            <div className="text-4xl font-bold text-charcoal">{stats.total}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-farmer">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-harvest" />
              <h2 className="font-heading text-xl font-bold text-forest">Today's Analyses</h2>
            </div>
            <div className="text-4xl font-bold text-charcoal">{stats.today}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-farmer">
          <h2 className="font-heading text-xl font-bold text-forest mb-4">System Status</h2>
          <p className="text-charcoal">Admin features coming soon...</p>
        </div>
      </main>
    </div>
  );
}

