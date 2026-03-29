import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Leaf } from 'lucide-react';
import CameraCapture from '../components/CameraCapture';
import { motion } from 'framer-motion';
import { uploadImage } from '../services/api';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

export default function Home() {
  const [captureMode, setCaptureMode] = useState<'camera' | 'upload' | null>(null);
  const [farmerInfo, setFarmerInfo] = useState({ name: '', location: '', phone: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useTranslation();

  const handleImageCapture = async (imageBlob: Blob) => {
    if (!isAuthenticated) return;

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('image', imageBlob);
      formData.append('cropType', 'auto');

      formData.append('farmerName', farmerInfo.name || user?.farmerName || '');
      formData.append('location', farmerInfo.location || user?.location || '');
      formData.append('phone', farmerInfo.phone || user?.phone || '');
      if (user?.id) {
        formData.append('userId', user.id);
      }

      const response = await uploadImage(formData);
      toast.success(t('analysis_complete'));
      navigate(`/results/${response.data.analysisId}`);
    } catch (error) {
      toast.error(t('analysis_failed'));
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/bg-field.png')" }}
    >
      <div className="min-h-screen bg-black/40 backdrop-blur-[2px]">

        {/* Header */}
        <header className="py-6 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <Leaf className="w-8 h-8 text-harvest" />
              <div>
                <h1 className="font-heading text-2xl font-bold">{t('app_name')}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition text-sm font-semibold backdrop-blur-md border border-white/30"
                >
                  {t('my_certificates')}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-harvest hover:bg-orange-600 text-white rounded-lg transition text-sm font-semibold shadow-lg"
                >
                  {t('login')}
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
              {t('hero_title')}<br />
              <span className="text-harvest">{t('hero_subtitle')}</span><br />
              {t('hero_tagline')}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
              {t('hero_desc')}
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setCaptureMode('camera')}
                className="flex items-center gap-3 bg-forest hover:bg-green-800 text-white px-8 py-4 rounded-full font-heading text-lg font-bold transition shadow-xl transform hover:scale-105"
              >
                <Camera className="w-6 h-6" />
                {t('start_checking')}
              </button>
              <button
                onClick={() => document.getElementById('file-upload')?.click()}
                className="flex items-center gap-3 bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-full font-heading text-lg font-bold transition shadow-xl backdrop-blur-md border border-white/30"
              >
                <Upload className="w-6 h-6" />
                {t('upload_photo')}
              </button>
            </div>

            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageCapture(file);
              }}
            />
          </motion.div>

          {(!user?.farmerName || !user?.location) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl max-w-lg mx-auto w-full mb-8 text-left"
            >
              <h3 className="text-forest font-bold mb-4">{t('confirm_details')}</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder={t('farmer_name')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-harvest outline-none"
                  value={farmerInfo.name || user?.farmerName || ''}
                  onChange={(e) => setFarmerInfo({ ...farmerInfo, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder={t('location')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-harvest outline-none"
                  value={farmerInfo.location || user?.location || ''}
                  onChange={(e) => setFarmerInfo({ ...farmerInfo, location: e.target.value })}
                />
              </div>
            </motion.div>
          )}

          {captureMode === 'camera' && (
            <CameraCapture
              onCapture={handleImageCapture}
              onClose={() => setCaptureMode(null)}
              isAnalyzing={isAnalyzing}
            />
          )}
        </main>
      </div>
    </div>
  );
}
