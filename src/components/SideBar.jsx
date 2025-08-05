import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bookmark, ChevronsLeftRight, ChevronsRightLeftIcon, Flame, Home, LayoutDashboard, Mail, Receipt, ReceiptText, Settings } from 'lucide-react';
import Add from './UI/Add';


const menuItems = [
  { label: 'Home', path: '/home', icon: <Home className="w-5 h-5" /> },
  { label: 'Explore', path: '/explore', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Favourite', path: '/favorites', icon: <Bookmark className="w-5 h-5" /> },
  { label: 'Orders', path: '/orders', icon: <ReceiptText className="w-5 h-5" /> },
  { label: 'Messages', path: '/messages', icon: <Mail className="w-5 h-5" /> },
  { label: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'Mark Clarke';

  return (
    <div className="w-[304px] h-min-screen bg-[#F7F7F7] shadow-lg text-white flex flex-col p-6 font-montserrat rounded-r-[30px]">
        <img className='w-30  0 h-10' src="./Logo.svg" alt="" />
      <nav className="flex mt-10 flex-col gap-3 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex w-full h-12 items-center gap-3 text-sm px-4 py-1 mt-[10px] rounded-[12px] hover:bg-[#503E9D]/10 transition ${
                isActive ? 'bg-[#503E9D] ' : 'text-gray-700'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="flex items-center justify-between border-t border-gray-200 pt-6">
        <Add  />
      </div>
      <div className="flex items-center gap-5 mt-6">
        <div className='bg-[#FACD5D] w-12 h-12 rounded-full flex items-center justify-center'>
          <img src="./User.svg" alt="" />
        </div>
        <div className='flex flex-col'>
          <span className='font-semibold text-[#182135]'>{userName}</span>
          <span className='text-sm text-gray-500'>markClarke@mail.com</span>
        </div>
        <div className='rotate-90'>
           <ChevronsLeftRight className='text-black' />
        </div>
      </div>
    </div>
  );
}
