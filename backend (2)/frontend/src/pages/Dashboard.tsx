import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, FileText, Calendar, Award, ArrowRight, Leaf } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getMyCertificates } from '../services/api';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

interface Certificate {
  _id: string;
  analysisId: string;
  cropType: string;
  overallGrade: string;
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    Reject: number;
  };
  detectionResults: {
    totalCount: number;
  };
  farmerInfo: {
    name: string;
    location: string;
  };
  createdAt: string;
}

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCertificates();
  }, [isAuthenticated, navigate]);

  const fetchCertificates = async () => {
    try {
      const response = await getMyCertificates();
      setCertificates(response.data.certificates);
    } catch (error: any) {
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        toast.error('Failed to load certificates');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const gradeColors = {
    A: 'bg-grade-a text-white',
    B: 'bg-grade-b text-charcoal',
    C: 'bg-grade-c text-white',
    Reject: 'bg-reject text-white',
    Mixed: 'bg-soil text-white'
  };

  if (loading) {
    return <LoadingSpinner message="Loading your certificates..." />;
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <header className="bg-forest text-white py-4 px-4 shadow-farmer">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="w-8 h-8" />
            <div>
              <h1 className="font-heading text-xl font-bold">My Certificates</h1>
              <p className="text-sm text-cream">
                {user?.farmerName || user?.username} • {user?.location || 'No location'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="px-4 py-2 bg-leaf/20 hover:bg-leaf/30 rounded-lg transition text-sm font-semibold"
            >
              New Analysis
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-reject/20 hover:bg-reject/30 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-farmer">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-forest" />
              <h3 className="font-semibold text-charcoal">Total Certificates</h3>
            </div>
            <div className="text-3xl font-bold text-forest">{certificates.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-farmer">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-grade-a" />
              <h3 className="font-semibold text-charcoal">Grade A</h3>
            </div>
            <div className="text-3xl font-bold text-grade-a">
              {certificates.filter(c => c.overallGrade === 'A').length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-farmer">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-grade-b" />
              <h3 className="font-semibold text-charcoal">Grade B</h3>
            </div>
            <div className="text-3xl font-bold text-grade-b">
              {certificates.filter(c => c.overallGrade === 'B').length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-farmer">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-grade-c" />
              <h3 className="font-semibold text-charcoal">Grade C</h3>
            </div>
            <div className="text-3xl font-bold text-grade-c">
              {certificates.filter(c => c.overallGrade === 'C').length}
            </div>
          </div>
        </div>

        {/* Certificates List */}
        {certificates.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-farmer text-center">
            <FileText className="w-16 h-16 text-light-gray mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">
              No Certificates Yet
            </h2>
            <p className="text-soil mb-6">
              Start analyzing your crops to generate certificates
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white rounded-xl font-semibold hover:bg-leaf transition"
            >
              Create First Analysis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-farmer hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-heading text-xl font-bold text-forest">
                        {cert.cropType.charAt(0).toUpperCase() + cert.cropType.slice(1)} Analysis
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-lg font-bold text-sm ${
                          gradeColors[cert.overallGrade as keyof typeof gradeColors]
                        }`}
                      >
                        Grade {cert.overallGrade}
                      </span>
                    </div>
                    <p className="text-soil text-sm mb-2">ID: {cert.analysisId}</p>
                    <div className="flex items-center gap-4 text-sm text-charcoal">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {cert.detectionResults.totalCount} items
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(cert.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/certificate/${cert.analysisId}`}
                    className="flex items-center gap-2 px-6 py-3 bg-forest text-white rounded-lg font-semibold hover:bg-leaf transition"
                  >
                    View Certificate
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

