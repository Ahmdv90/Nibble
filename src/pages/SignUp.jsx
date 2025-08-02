import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Key, KeyRound, Mail, User } from 'lucide-react';
import API from '../../axios';
import Button from '../components/UI/Button';

export default function SignUP() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await API.post('/auth/register/', {
        first_name: username,
        email,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        localStorage.setItem('__token_', response.data.token);
        navigate('/home');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      console.log('Registration failed. Please check your inputs.');
    }
  };

  return (
    <div className='flex h-screen'>
      <div>
        <img className='rounded-r-[24px] h-full w-[800px] object-cover' src="./Nibble.svg" alt="Signup Visual" />
        <img src="./Logo.svg" alt="" />
      </div>
      <div className='flex items-center justify-center w-full'>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4 w-125'>
            <h1 className="font-bold text-[32px] leading-[40px] tracking-[0px] font-['Open_Sans']">Create an Account</h1>
            <p className="font-normal text-[16px] text-[#626264] leading-[32px] tracking-[0px] font-['Open_Sans']">Plese create an account to continue using our service</p>
            <div className='flex flex-col gap-2'>
              <span className='font-bold text-[12px] leading-[24px] tracking-[1px] uppercase font-["Open_Sans"] '>Full Name</span>
              <label htmlFor="username " className='flex gap-3 items-center border-b-1 border-[#A3A3A429]'>
              <div className='w-[40px] p-2 h-[40px] border-none flex-1 rounded-lg bg-[#503E9D1A] '>
                <User className='text-[#503E9D]' />
              </div>
            <input
              type="text"
              icon={<User />}
              placeholder='Mark Clarke'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='border-b-1 border-[#A3A3A429] aliased p-2 w-full outline-none'
              required
            /></label>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='font-bold text-[12px] leading-[24px] tracking-[1px] uppercase font-["Open_Sans"] '>Email</span>
              <label htmlFor="email" className='flex gap-3 items-center border-b-1 border-[#A3A3A429]'>
                <div className='w-[40px] p-2 h-[40px] border-none flex-1 rounded-lg bg-[#503E9D1A] '>
                  <Mail className='text-[#503E9D]' />
                </div>
                <input
                  type="email"
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='border-b-1 border-[#A3A3A429] aliased p-2 w-full outline-none'
                  required
                />
              </label>
            </div>
            <div className='flex flex-col gap-2'>
              <span className='font-bold text-[12px] leading-[24px] tracking-[1px] uppercase font-["Open_Sans"] '>Password</span>
              <label htmlFor="password" className='flex gap-3 items-center border-b-1 border-[#A3A3A429]'>
                <div className='w-[40px] p-2 h-[40px] border-none flex-1 rounded-lg bg-[#503E9D1A] '>
                  <KeyRound className='text-[#503E9D]' />
                </div>
                <input
                  type="password"
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='border-b-1 border-[#A3A3A429] aliased p-2 w-full outline-none'
                  required
                />
              </label>
            </div>
            <Button
              type="submit"
            >
              Create an Account
            </Button>
            <p className='text-[16px] text-center text-[#626264] leading-[24px] tracking-[0.4px] font-["Open_Sans"]'>Already have an account? <Link to="/login" className='text-[red]'>Sign In</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}
