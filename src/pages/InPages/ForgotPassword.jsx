import React, { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../../axios/index';
import Button from '../../components/UI/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      const response = await API.post('/auth/password-reset/request/', { email });

      if (response.status === 200) {
        setShowModal(true); 
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      alert('Could not send reset link. Please try again.');
    }
  };

  const handleGotIt = () => {
    navigate('/verify-code', { state: { email } });
  };

  const handleSendAgain = async () => {
    try {
      await API.post('/auth/password-reset/request/', { email });
      alert('Reset link sent again.');
    } catch {
      alert('Failed to resend email.');
    }
  };

  return (
    <div className='flex h-screen relative'>
      <div>
        <img className='rounded-r-[24px] h-full w-[800px] object-cover' src="./Nibble.svg" alt="Reset Visual" />
      </div>

      <div className='flex items-center justify-center w-full'>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4 w-125'>
            <h1 className="font-bold text-[32px] leading-[40px] font-['Open_Sans']">Forgot Password?</h1>
            <p className="text-[16px] text-[#626264] leading-[32px] font-['Open_Sans']">
              Please enter your email address to continue
            </p>

            <div className='flex flex-col gap-2'>
              <span className='text-[12px] font-bold uppercase tracking-[1px]'>Email</span>
              <label htmlFor="email" className='flex gap-3 items-center border-b border-[#A3A3A429]'>
                <div className='w-[40px] p-2 h-[40px] bg-[#503E9D1A] rounded-lg flex items-center justify-center'>
                  <Mail className='text-[#503E9D]' />
                </div>
                <input
                  type="email"
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='p-2 w-full outline-none'
                  required
                />
              </label>
            </div>

            <Button >Continue</Button>
          </div>
        </form>
      </div>

      {showModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent z-50">
          <div className="bg-white w-[400px] p-6 rounded-xl shadow-lg text-center relative">
            <button
              className="absolute top-4 right-4 text-[#503E9D]"
              onClick={() => setShowModal(false)}
            >
              <X />
            </button>

            <div className="w-[48px] h-[48px] bg-[#503E9D] mx-auto mb-4 rounded-full flex items-center justify-center">
              <Mail className="text-[white]" />
            </div>

            <h2 className="text-[20px] font-bold mb-2">Reset email sent</h2>
            <p className="text-sm text-[#626264]">
              We have just sent an email with a password reset link to <span className="font-semibold">{email}</span>.
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <Button type="submit" onClick={handleGotIt} variant="primary">
                Got it
              </Button>
              <Button onClick={handleSendAgain} variant="secondary">
                Send again
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}