import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/UI/Button';
import API from '../../../../lib/axios';
import { KeyRound } from 'lucide-react';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const otp = location.state?.otp;

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword) {
      setError('Все поля обязательны для заполнения.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await API.post('/auth/password-reset/complete/', {
        email,
        otp,
        new_password: newPassword,
      });

      if (response.status === 200) {
        alert('Пароль успешно сброшен!');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      setError('Неверный или просроченный код. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex h-screen justify-center items-center'>
      <form onSubmit={handleReset} className='flex flex-col gap-4 w-[400px] p-8 shadow-lg bg-white rounded-lg'>
        <h1 className='text-[24px] font-bold'>Сброс пароля</h1>
        <p className='text-[#626264]'>Установите новый пароль для <strong>{email}</strong>.</p>

        <label className='flex gap-3 items-center border-b border-[#A3A3A429]'>
          <div className='w-[40px] p-2 h-[40px] rounded-lg bg-[#503E9D1A] flex items-center justify-center'>
            <KeyRound className='text-[#503E9D]' />
          </div>
          <input
            type="password"
            placeholder='Новый пароль'
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError('');
            }}
            className='aliased p-2 w-full outline-none'
            required
          />
        </label>

        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? 'Сброс...' : 'Сбросить пароль'}
        </Button>
      </form>
    </div>
  );
}
