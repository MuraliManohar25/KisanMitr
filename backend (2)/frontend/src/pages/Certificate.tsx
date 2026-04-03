import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { getAnalysis } from '../services/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import LoadingSpinner from '../components/LoadingSpinner';
import QRCode from 'qrcode';

interface Analysis {
  analysisId: string;
  cropType: string;
  farmerInfo: { name: string; location: string; phone?: string };
  imageUrl: string;
  detectionResults: {
    totalCount: number;
  };
  overallGrade: string;
  gradeDistribution: { A: number; B: number; C: number; Reject: number };
  certificateHash: string;
  createdAt: string;
  diseaseDetected?: string;
  recommendations?: {
    grade_advice: string;
    pesticides?: {
      advice: string;
    };
  };
}

export default function Certificate() {
  const { analysisId } = useParams<{ analysisId: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!analysisId) return;
    getAnalysis(analysisId)
      .then((res) => {
        setAnalysis(res.data);
        // Generate QR code
        const verificationUrl = `${window.location.origin}/results/${analysisId}`;
        QRCode.toDataURL(verificationUrl)
          .then((url) => setQrCodeUrl(url))
          .catch(console.error);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [analysisId]);

  const downloadPDF = async () => {
    if (!certificateRef.current || !analysis) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`certificate-${analysis.analysisId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (loading) return <LoadingSpinner message="Loading certificate..." />;

  if (!analysis) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">Certificate Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-forest text-white rounded-xl font-semibold hover:bg-leaf transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const gradeColors = {
    A: '#2D5016',
    B: '#F4C430',
    C: '#FF8C42',
    Reject: '#C44536'
  };

  return (
    <div className="min-h-screen bg-warm-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(`/results/${analysisId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-lg hover:bg-leaf transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Results
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-6 py-3 bg-harvest text-charcoal rounded-xl font-semibold hover:bg-yellow-400 transition shadow-md"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>

        {/* Certificate */}
        <div
          ref={certificateRef}
          className="bg-white rounded-2xl p-12 shadow-farmer border-4 border-forest relative overflow-hidden"
          style={{ minHeight: '600px' }}
        >
          {/* Watermark/Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-forest/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-harvest/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <h1 className="font-heading text-4xl font-bold text-forest mb-2">
              Fair-Trade Quality Certificate
            </h1>
            <div className="w-32 h-1 bg-harvest mx-auto"></div>
          </div>

          <div className="flex gap-8 mb-8 relative z-10">
            {/* Left Column: Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="font-heading text-lg font-bold text-forest border-b border-light-gray pb-1 mb-2">Farmer Information</h3>
                <div className="text-charcoal text-sm space-y-1">
                  <p><span className="font-semibold">Name:</span> {analysis.farmerInfo.name}</p>
                  <p><span className="font-semibold">Location:</span> {analysis.farmerInfo.location}</p>
                  {analysis.farmerInfo.phone && <p><span className="font-semibold">Phone:</span> {analysis.farmerInfo.phone}</p>}
                </div>
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold text-forest border-b border-light-gray pb-1 mb-2">Assessment Details</h3>
                <div className="text-charcoal text-sm space-y-1">
                  <p><span className="font-semibold">Crop:</span> {analysis.cropType}</p>
                  <p><span className="font-semibold">Quantity:</span> {analysis.detectionResults.totalCount} items</p>
                  <p><span className="font-semibold">Analyzed:</span> {new Date(analysis.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Grade & Recommendations */}
            <div className="flex-1 space-y-6">
              <div className="bg-light-gray/30 p-4 rounded-xl text-center border border-light-gray">
                <p className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-1">Overall Grade</p>
                <div
                  className="text-4xl font-bold inline-block px-4 py-1 rounded-lg"
                  style={{ color: gradeColors[analysis.overallGrade as keyof typeof gradeColors] }}
                >
                  {analysis.overallGrade}
                </div>
              </div>

              {/* Farmer Advice Section */}
              {analysis.recommendations && (
                <div className="bg-cream/50 p-4 rounded-xl border border-soil/10 text-sm">
                  <h4 className="font-bold text-soil mb-1 flex items-center gap-2">
                    Expert Recommendation
                  </h4>
                  <p className="text-charcoal italic mb-2">"{analysis.recommendations.grade_advice}"</p>

                  {analysis.diseaseDetected && analysis.diseaseDetected !== 'No Disease Detected' && analysis.diseaseDetected !== 'Healthy' && (
                    <div className="mt-2 text-reject font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs">Issue: {analysis.diseaseDetected}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Image & Stats Row */}
          <div className="flex gap-6 mb-8 items-start relative z-10">
            {/* Small Crop Image */}
            {analysis.imageUrl && (
              <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border-2 border-light-gray shadow-sm">
                <img
                  src={`http://https://kisanmitr.up.railway.app/${analysis.imageUrl}`}
                  alt="Crop"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Grade Stats */}
            <div className="flex-1 grid grid-cols-4 gap-2">
              {Object.entries(analysis.gradeDistribution).map(([grade, count]) => (
                <div
                  key={grade}
                  className="text-center p-2 rounded-lg"
                  style={{ backgroundColor: `${gradeColors[grade as keyof typeof gradeColors]}10` }}
                >
                  <div className="text-xl font-bold" style={{ color: gradeColors[grade as keyof typeof gradeColors] }}>
                    {count}
                  </div>
                  <div className="text-xs font-semibold text-charcoal">Grade {grade}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-light-gray pt-6 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex-1">
              <p className="text-sm text-soil font-bold">KisanMitr Certified</p>
              <p className="text-xs text-soil mt-1 font-mono">{analysis.certificateHash}</p>
            </div>
            {qrCodeUrl && (
              <div className="text-center">
                <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20 mx-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
