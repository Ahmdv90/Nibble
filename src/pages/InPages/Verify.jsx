import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../../../lib/axios';
import Button from '../../components/UI/Button';

export default function VerifyCode() {
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer === 0) return;
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updatedCode = [...code];
    updatedCode[index] = value;
    setCode(updatedCode);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      const fullCode = code.join('');
      const response = await API.post('/auth/password-reset/verify/', {
        email,
        otp: fullCode,
      });

      if (response.status === 200) {
        navigate('/reset-password', { state: { email, otp: fullCode } });
      }
    } catch (err) {
      alert('Invalid or expired code. Please try again.');
    }
  };

  const handleResendCode = async () => {
    try {
      await API.post('/auth/password-reset/request/', { email });
      setTimer(60); 
    } catch {
      alert('Failed to resend code.');
    }
  };

  return (
    <div className='flex h-screen justify-center items-center'>
      <div className='flex flex-col gap-4 w-[400px] p-8 shadow-lg bg-white rounded-lg'>
        <h1 className='text-[24px] font-bold'>Verify your email</h1>
        <p className='text-[#626264]'>We sent a 4-digit code to <strong>{email}</strong>. Please enter it below.</p>

        <div className='flex gap-4 justify-center mt-4'>
          {code.map((digit, i) => (
            <input
              key={i}
              id={`code-${i}`}
              type="text"
              value={digit}
              maxLength="1"
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              ref={el => inputRefs.current[i] = el}
              className='w-12 h-12 text-center border border-gray-300 rounded-lg text-lg'
            />
          ))}
        </div>

        <Button onClick={handleVerify} className="mt-4">Verify</Button>

        <div className='flex justify-between items-center mt-4 text-sm'>
          <span className='text-[#626264]'>Didn’t receive the code?</span>
          <button
            onClick={handleResendCode}
            className='text-[#503E9D] font-medium disabled:opacity-50'
            disabled={timer > 0}
          >
            {timer > 0 ? `Send again in ${timer}s` : 'Send again'}
          </button>
        </div>
      </div>
    </div>
  );
}
