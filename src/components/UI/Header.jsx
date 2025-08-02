import React from 'react'
import { NavLink } from 'react-router-dom';
import { ChevronsLeftRight, LocateFixed, ShoppingBag, TicketPercent, Search, ListFilter, ShoppingCart } from 'lucide-react';
import Button from './Button';

export default function Header() {
  return (
    <header className='flex  justify-between p-8 mx-4 bg-white'>
      <nav >
        <div className='flex items-center gap-4'>
          <div className='flex gap-3 items-center'>
            <LocateFixed className='text-[#503E9D] font-semibold text-lg' />
            <p className='font-normal text-[16px] text-[#626264] leading-[32px] tracking-[0px] font-["Open_Sans"]'>
              San Francisco, California
            </p>
            <div className='rotate-90'>
              <ChevronsLeftRight className='text-black' />
            </div>
          </div>
          <div className='flex gap-3 items-center'>
            <ShoppingBag className='text-[#FB6D3A] font-semibold text-lg' />
            <p className='font-normal text-[16px] text-[#626264] leading-[32px] tracking-[0px] font-["Open_Sans"]'>
              Pick Up
            </p>
            <div className='rotate-90'>
              <ChevronsLeftRight className='text-black' />
            </div>
          </div>
          <div className='flex gap-3 items-center'>
            <TicketPercent className='text-[#FACD5D] font-semibold text-lg' />
            <p className='font-normal text-[16px] text-[#626264] leading-[32px] tracking-[0px] font-["Open_Sans"]'>
                Best deals
            </p>
            <div className='rotate-90'>
              <ChevronsLeftRight className='text-black' />
            </div>
          </div>
          <div className="relative flex items-center">
            <span className="absolute left-3">
              <Search/>
            </span>
            <input
              type="text"
              id="search"
              placeholder="Search for anything..."
              className=" w-100 h-12 border border-none bg-[#F7F7F7] rounded-lg p-2 pl-10"
            />
          </div>
          <div>
            <Button size='small' className='text-center '><ListFilter/></Button>
          </div>
          <div>
            <Button size='small' className='text-center bg-[#FB6D3A]'><ShoppingCart /></Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
