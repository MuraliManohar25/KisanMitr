import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Leaf, Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { login, register } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-toastify';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    farmerName: '',
    location: '',
    phone: ''
  });
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await login(formData.username, formData.password);
        setAuth(response.data.user, response.data.token);
        toast.success('Login successful! 🎉');
        navigate('/');
      } else {
        // ✅ new
        const response = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          farmerName: formData.farmerName,
          location: formData.location,
          phone: formData.phone
        });
        setAuth(response.data.user, response.data.token);
        toast.success('Account created successfully! 🎉');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-white to-cream flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="w-10 h-10 text-forest" />
            <h1 className="font-heading text-3xl font-bold text-forest">
              KisanMitr
            </h1>
          </div>
          <p className="text-charcoal">
            {isLogin ? 'Sign in to start scanning' : 'Create an account to get started'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-farmer border-t-4 border-harvest">
          {/* Toggle */}
          <div className="flex gap-2 mb-6 bg-light-gray rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md font-semibold transition ${isLogin
                  ? 'bg-forest text-white'
                  : 'text-charcoal hover:bg-gray-200'
                }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md font-semibold transition ${!isLogin
                  ? 'bg-forest text-white'
                  : 'text-charcoal hover:bg-gray-200'
                }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soil" />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-light-gray focus:border-harvest outline-none transition"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soil" />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-light-gray focus:border-harvest outline-none transition"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soil" />
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-light-gray focus:border-harvest outline-none transition"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Farmer Name (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border-2 border-light-gray focus:border-harvest outline-none transition"
                    placeholder="Your name"
                    value={formData.farmerName}
                    onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border-2 border-light-gray focus:border-harvest outline-none transition"
                    placeholder="Your location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest text-white py-3 rounded-xl font-heading font-semibold hover:bg-leaf transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
