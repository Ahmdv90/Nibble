import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, Mail } from 'lucide-react';
import API from '../../axios';
import Button from '../components/UI/Button';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/auth/login/', {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token_key;
        localStorage.setItem('__token_', token);
        console.log('Login successful:', response.data);
        navigate('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid email or password');
    }
  };

  return (
    <div className='flex h-screen'>
      <div>
        <img className='rounded-r-[24px] h-full w-[800px] object-cover' src="./Nibble.svg" alt="Login Visual" />
        <img src="./Logo.svg" alt="" />
      </div>
      <div className='flex items-center justify-center w-full'>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4 w-125'>
            <h1 className="font-bold text-[32px] leading-[40px] tracking-[0px] font-['Open_Sans']">Welcome!</h1>
            <p className="font-normal text-[16px] text-[#626264] leading-[32px] tracking-[0px] font-['Open_Sans']">Sign in to your account to continue </p>

            <div className='flex flex-col gap-2'>
              <span className='font-bold text-[12px] leading-[24px] tracking-[1px] uppercase font-["Open_Sans"] '>Email</span>
              <label htmlFor="email" className='flex gap-3 items-center border-b border-[#A3A3A429]'>
                <div className='w-[40px] p-2 h-[40px] rounded-lg bg-[#503E9D1A] flex items-center justify-center'>
                  <Mail className='text-[#503E9D]' />
                </div>
                <input
                  type="email"
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='aliased p-2 w-full outline-none'
                  required
                />
              </label>
            </div>

            <div className='flex flex-col gap-2'>
              <span className='font-bold text-[12px] leading-[24px] tracking-[1px] uppercase font-["Open_Sans"] '>Password</span>
              <label htmlFor="password" className='flex gap-3 items-center border-b border-[#A3A3A429]'>
                <div className='w-[40px] p-2 h-[40px] rounded-lg bg-[#503E9D1A] flex items-center justify-center'>
                  <KeyRound className='text-[#503E9D]' />
                </div>
                <input
                  type="password"
                  placeholder='********'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='aliased p-2 w-full outline-none'
                  required
                />
              </label>
            </div>

            <Button variant="thirdary">Sign In</Button>
            <p className='text-center text-[16px] text-[#626264] leading-[24px] tracking-[0px] font-["Open_Sans"]'><Link to="/forgot-password">Forgot Password?</Link></p>
            <Button
              onClick={() => navigate('/signup')}
            >
              Create an Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
