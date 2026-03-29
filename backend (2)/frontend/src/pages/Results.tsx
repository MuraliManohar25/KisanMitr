import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle, XCircle, AlertCircle, Sprout, Bug } from 'lucide-react';
import { getAnalysis } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

interface Analysis {
  analysisId: string;
  cropType: string;
  farmerInfo: { name: string; location: string; phone?: string };
  imageUrl: string;
  detectionResults: {
    totalCount: number;
    items: Array<{
      id: number;
      diameter: number;
      grade: string;
      colorProfile: { avgRGB: number[]; dominantHue: number };
    }>;
  };
  overallGrade: string;
  gradeDistribution: { A: number; B: number; C: number; Reject: number };
  certificateHash: string;
  // New fields
  diseaseDetected?: string;
  recommendations?: {
    grade_advice: string;
    storage?: string;
    fertilizer?: string;
    disease_note?: string;
    pesticides?: {
      organic: string;
      chemical: string;
      advice: string;
    };
  };
}

export default function Results() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!analysisId) return;
    getAnalysis(analysisId)
      .then((res) => {
        setAnalysis(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [analysisId]);

  if (loading) return <LoadingSpinner message="Loading results..." />;

  if (!analysis) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-reject mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">Analysis Not Found</h2>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-forest text-white rounded-xl font-semibold hover:bg-leaf transition">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const gradeColors = {
    A: 'bg-grade-a text-white',
    B: 'bg-grade-b text-charcoal',
    C: 'bg-grade-c text-white',
    Reject: 'bg-reject text-white'
  };

  const hasDisease = analysis.diseaseDetected && analysis.diseaseDetected !== "No Disease Detected" && analysis.diseaseDetected !== "Healthy";

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="bg-forest text-white py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-leaf rounded-lg transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-heading text-xl font-bold">Analysis Results</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 shadow-farmer mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-forest mb-2">{analysis.farmerInfo.name}</h2>
              <p className="text-charcoal">{analysis.farmerInfo.location}</p>
              <p className="text-sm text-soil mt-1">ID: {analysis.analysisId}</p>
            </div>
            <div className={`px-6 py-3 rounded-xl font-heading font-bold text-xl ${gradeColors[analysis.overallGrade as keyof typeof gradeColors]}`}>
              Grade {analysis.overallGrade}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-light-gray rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-forest mb-1">{analysis.detectionResults.totalCount}</div>
              <div className="text-sm text-charcoal">Total Items</div>
            </div>
            <div className="bg-grade-a/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-grade-a mb-1">{analysis.gradeDistribution.A}</div>
              <div className="text-sm text-charcoal">Grade A</div>
            </div>
            <div className="bg-grade-b/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-grade-b mb-1">{analysis.gradeDistribution.B}</div>
              <div className="text-sm text-charcoal">Grade B</div>
            </div>
            <div className="bg-grade-c/10 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-grade-c mb-1">{analysis.gradeDistribution.C}</div>
              <div className="text-sm text-charcoal">Grade C</div>
            </div>
          </div>

          <Link to={`/certificate/${analysis.analysisId}`} className="flex items-center justify-center gap-3 bg-forest text-white px-8 py-4 rounded-xl font-heading font-semibold hover:bg-leaf transition shadow-md w-full md:w-auto">
            <Download className="w-6 h-6" />
            Download Certificate
          </Link>
        </motion.div>

        {/* Health Check & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Crop Health Status */}
          <div className={`rounded-2xl p-6 shadow-farmer border-l-8 ${hasDisease ? 'bg-red-50 border-reject' : 'bg-green-50 border-leaf'}`}>
            <h3 className={`font-heading text-xl font-bold mb-4 flex items-center gap-2 ${hasDisease ? 'text-reject' : 'text-leaf'}`}>
              {hasDisease ? <Bug /> : <CheckCircle />}
              Crop Health Analysis
            </h3>
            <p className="text-lg font-semibold mb-2">
              Status: {analysis.diseaseDetected || "Healthy"}
            </p>
            {hasDisease ? (
              <p className="text-charcoal mb-4">
                We detected signs of potential disease. See recommendations below.
              </p>
            ) : (
              <p className="text-charcoal">
                Your crop looks healthy! No significant spots or rot detected.
              </p>
            )}
          </div>

          {/* AI Suggestions */}
          <div className="bg-white rounded-2xl p-6 shadow-farmer">
            <h3 className="font-heading text-xl font-bold text-forest mb-4 flex items-center gap-2">
              <Sprout />
              AI Suggestions
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-cream rounded-lg border border-soil/20">
                <p className="text-sm font-bold text-soil mb-1">Grade Advice:</p>
                <p className="text-charcoal">{analysis.recommendations?.grade_advice || "Maintain current practices."}</p>
              </div>
              {analysis.recommendations?.storage && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-bold text-blue-700 mb-1">Storage Tip:</p>
                  <p className="text-charcoal">{analysis.recommendations.storage}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pesticide Recommendations (Only if disease) */}
        {hasDisease && analysis.recommendations?.pesticides && (
          <div className="bg-white rounded-2xl p-6 shadow-farmer mb-6 border-2 border-reject/20">
            <div className="flex items-center gap-3 mb-4 text-reject">
              <AlertCircle className="w-8 h-8" />
              <h3 className="font-heading text-xl font-bold">Treatment Recommendations</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h4 className="font-bold text-forest mb-2">🌱 Organic Approach</h4>
                <p className="text-charcoal mb-2 font-medium">{analysis.recommendations.pesticides.organic}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <h4 className="font-bold text-orange-700 mb-2">⚗️ Chemical Approach</h4>
                <p className="text-charcoal mb-2 font-medium">{analysis.recommendations.pesticides.chemical}</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-charcoal italic">
              <strong>Expert Note:</strong> {analysis.recommendations.pesticides.advice}
            </div>
          </div>
        )}

        {/* Image Preview */}
        {analysis.imageUrl && (
          <div className="bg-white rounded-2xl p-6 shadow-farmer mb-6">
            <h3 className="font-heading text-xl font-bold text-forest mb-4">Harvest Image</h3>
            <img
              src={`http://localhost:5000${analysis.imageUrl}`}
              alt="Harvest"
              className="h-64 w-auto object-cover rounded-xl mx-auto shadow-md"
            />
          </div>
        )}

        {/* Grade Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-farmer">
          <h3 className="font-heading text-xl font-bold text-forest mb-4">Grade Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analysis.gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="flex items-center gap-4">
                <div className="w-20 font-semibold text-charcoal">{grade}</div>
                <div className="flex-1 bg-light-gray rounded-full h-8 overflow-hidden">
                  <div
                    className={`h-full flex items-center justify-end pr-2 text-sm font-semibold ${gradeColors[grade as keyof typeof gradeColors]}`}
                    style={{ width: `${(count / analysis.detectionResults.totalCount) * 100}%` }}
                  >
                    {count > 0 && count}
                  </div>
                </div>
                <div className="w-12 text-right font-semibold text-charcoal">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
