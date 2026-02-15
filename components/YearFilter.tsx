"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface YearFilterProps {
  selectedYear: number;
}

export default function YearFilter({ selectedYear }: YearFilterProps) {
  const router = useRouter();
  const startYear = 2018;
  const endYear = 2025;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  const [localYear, setLocalYear] = useState(selectedYear);

  useEffect(() => {
    setLocalYear(selectedYear);
  }, [selectedYear]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalYear(parseInt(e.target.value));
  };

  const handleRelease = (e: any) => {
    router.push(`/?year=${e.target.value}`);
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md p-4 rounded-2xl border border-zinc-800 shadow-xl w-full">
      <div className="flex flex-col md:flex-row items-center gap-6">
        
        {/* Título e Indicador */}
        <div className="flex items-center gap-3 min-w-fit">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Generación</span>
          <div className="bg-blue-600 px-3 py-1 rounded-lg">
            <span className="text-xl font-black text-white italic">{localYear}</span>
          </div>
        </div>

        {/* Slider Central */}
        <div className="flex-grow w-full px-4">
          <input
            type="range"
            min={startYear}
            max={endYear}
            step="1"
            value={localYear}
            onChange={handleChange}
            onMouseUp={handleRelease}
            onTouchEnd={handleRelease}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
          />
          <div className="flex justify-between w-full mt-2">
            {years.map((y) => (
              <span 
                key={y} 
                className={`text-[9px] font-bold transition-all ${localYear === y ? 'text-blue-400 scale-125' : 'text-zinc-600'}`}
              >
                {y}
              </span>
            ))}
          </div>
        </div>

        {/* Info lateral compacta */}
        <div className="hidden lg:block text-right min-w-fit">
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Historial</p>
          <p className="text-[11px] text-zinc-400 font-black tracking-tighter">TOTAL 8 AÑOS</p>
        </div>

      </div>
    </div>
  );
}