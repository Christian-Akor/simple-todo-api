import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../lib/api';

export default function VerifyOtp() {
  const router = useRouter();
  const { email } = router.query;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/verify-otp', {
        emailOrPhone: email,
        otp,
      });

      // Store token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast.success('OTP verified successfully!');
        router.push('/');
      } else {
        toast.error('Verification successful but no token received');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Verify OTP
            </h1>
            <p className="text-gray-600 text-center mb-6">
              Enter the OTP sent to {email || 'your email/phone'}
            </p>

            <form onSubmit={handleSubmit}>
              <Input
                label="OTP Code"
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                maxLength={6}
                required
              />

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full"
              >
                Verify OTP
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => toast.info('Resend OTP functionality coming soon')}
                className="text-sm text-blue-600 hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
