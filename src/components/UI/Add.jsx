import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

export default function Add() {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || closed) return null;

  return (
    <div className="sticky bottom-20 left-8 z-50">
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-[240px] text-center font-sans z-20">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={() => setClosed(true)}
          aria-label="Закрыть"
        >
          ✕
        </button>

        <div className="bg-[#FFECE6] w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Flame className="text-orange-500 text-xl" />
        </div>

        <p className="font-bold text-black leading-snug mb-2">
          Free delivery on <br />
          all orders over <span className="text-[#E45725] font-bold">$25</span>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          It is a limited time offer that will expire soon.
        </p>

        <button className="bg-[#5E3CF7] text-white font-semibold text-sm rounded-full px-5 py-3 hover:bg-[#4b2cd4] transition flex items-center justify-center gap-2 mx-auto">
          Order now <span className="text-base">→</span>
        </button>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-[200px] h-5 bg-white rounded-2xl shadow-md blur-sm"></div>
      <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 z-0 w-[180px] h-5 bg-white rounded-2xl shadow-sm blur-sm opacity-80"></div>
    </div>
  );
}
