import React, { useState } from 'react'
import Button from './../components/UI/Button';
import { Banknote, Bike, FireExtinguisherIcon, Flame, Map, Store, Utensils, Wallet } from 'lucide-react';
import restaurants from '../MockData/restaurant.json'; 
import aFoods from '../MockData/aFoods.json';

const categories = [
  {id : 1, name: 'Popular', description: '286+ options', icon: <div className='bg-[#FB6D3A] w-[48px] h-[48px] rounded-lg text-[white] flex items-center justify-center'><Flame /></div>},
  {id : 2, name: 'Fast Delivery', description: '1,843+ options', icon: <div className='bg-[#503E9D] w-[48px] h-[48px] rounded-lg text-[white] flex items-center justify-center'><Bike /></div>},
  {id : 3, name: 'High Class', description: '25+ options', icon: <div className='bg-[#FACD5D] w-[48px] h-[48px] rounded-lg text-[white] flex items-center justify-center'><Wallet /></div>},
  {id : 4, name: 'Dine In', description: '182+ options', icon: <div className='bg-[#FB6D3A] w-[48px] h-[48px] rounded-lg text-[white] flex items-center justify-center'><Utensils /></div>},
  {id : 5, name: 'Pick Up', description: '3,548+ options', icon: <div className='bg-[#503E9D] w-[48px] h-[48px] rounded-lg text-[white] flex items-center justify-center'><Store /></div>},
  {id : 6, name: 'Nearest', description: '44+ options', icon: <div className='bg-[#FACD5D] w-[48px] h-[48px] rounded-lg text-[white] flex items-center justify-center'><Map /></div>},
]

export default function Home() {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className=''>
      <div > 
        <div className='flex items-center justify-between p-4'>
        <h1 className='font-bold text-[24px] font-OpenSans line-height-[32px]'>Explore Categories</h1>
        <Button variant='base' className='text-[#503E9D] font-bold text-[16px] font-OpenSans line-height-[24px] cursor-pointer'>See All › </Button>
        </div>
        <div
          className='flex gap-20 p-4 overflow-x-auto overlay cursor-pointer'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none', 
          }}
            onClick={() => setShowAll((prev) => !prev)}
        >
          <style>
            {`
              .overlay::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          {categories.map((category, index) => (
            <div
              key={index}
              className='w-[152px] h-[158px] flex flex-col items-center justify-between gap- p-5'
              style={{
                background: '#F7F7F7',
                border: '1px solid #F7F7F7',
                borderRadius: '16px'
              }}
            >
              {category.icon}
              <div className='flex flex-col items-center gap-2 text-center'>
                <h2 className='font-bold text-[16px] font-OpenSans line-height-[24px]'>{category.name}</h2>
                <p className='text-[12px] text-gray-600 font-OpenSans line-height-[16px]'>{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className='flex items-center justify-between p-4'>
          <h1 className='font-bold text-[24px] font-OpenSans line-height-[32px]'>Featured restaurants</h1>
          <Button
            variant='base'
            className='text-[#503E9D] font-bold text-[16px] font-OpenSans line-height-[24px] cursor-pointer'
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? 'Show less' : <>See all <span className="ml-1">›</span></>}
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-x-6 gap-y-4 px-2 pb-4">
          {(showAll ? restaurants : restaurants.slice(0, 6)).map((r) => (
            <div
              key={r.id}
              className="flex flex-row items-center  p-3 min-w-[320px] max-w-[340px] h-[110px]  relative"
            >
              <div className='w-[96px] h-[96px] rounded-lg flex items-center justify-center bg-[#F7F7F7] mr-4'>
                <img src={r.logo} alt={r.name} className="w-12 h-12 object-contain mx-auto my-auto" />
              </div>
              <div className="flex flex-col flex-1 justify-between h-full">
                <div>
                  <h3 className="font-bold text-[16px] font-OpenSans">{r.name}</h3>
                  <div className="flex items-center gap-2 text-[13px] text-gray-500 mt-1">
                    <span>⭐ {r.rating}</span>
                    <span className="text-gray-400">({r.reviews})</span>
                    <span className="capitalize flex gap-2"><Utensils className='w-4'/>{r.category}</span>
                    <span className="flex gap-2"><Banknote className='w-5'/>{r.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {r.delivery && (
                    <span className={`text-xs font-semibold px-2 py-[2px] rounded bg-[#F3F0FF] text-[#503E9D]`}>
                      {r.delivery}
                    </span>
                  )}
                  {r.promo && (
                    <span className={`text-xs font-semibold px-2 py-[2px] rounded ${r.promo.includes('Buy') ? 'bg-[#FFF0ED] text-[#FB6D3A]' : 'bg-[#F3F0FF] text-[#503E9D]'}`}>
                      {r.promo}
                    </span>
                  )}
                  {r.delivery_fee && (
                    <span className="text-xs font-semibold px-2 py-[2px] rounded bg-[#F3F0FF] text-[#503E9D]">
                      {r.delivery_fee}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-gray-400 mt-1">
                  <span>{r.distance_km} km</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className='flex items-center justify-between p-4'>
          <h1 className='font-bold text-[24px] font-OpenSans line-height-[32px]'>Asian food</h1>
          <Button
            variant='base'
            className='text-[#503E9D] font-bold text-[16px] font-OpenSans line-height-[24px] cursor-pointer'
          >
            See all <span className="ml-1">›</span>
          </Button>
        </div>
        <div
          className="flex justify-between px-4 pb-4 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>
            {`
              .asian-scroll::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          { aFoods.map((food, idx) => (
            <div
              key={idx}
              className="min-w-[340px] max-w-[360px]  rounded-xl  flex flex-col asian-scroll "
            >
              <div className="w-full h-[180px] rounded-xl overflow-hidden">
                <img src={food.img} alt={food.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col px-4 py-3">
                <span className="font-bold text-[18px]">{food.name}</span>
                <div className="flex items-center gap-2 mt-2">
                  {food.delivery_fee === 0 ? (
                    <span className="text-xs font-semibold px-2 py-[2px] rounded bg-[#F3F0FF] text-[#503E9D]">
                      Free delivery
                    </span>
                  ) : (
                    <span className="text-xs font-semibold px-2 py-[2px] rounded bg-[#F3F0FF] text-[#503E9D]">
                      ${food.delivery_fee} Delivery
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
