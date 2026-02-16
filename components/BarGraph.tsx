import React from 'react';
import { BarState } from '../types';

interface BarGraphProps {
  array: number[];
  indices: number[];
  state: BarState;
}

const BarGraph: React.FC<BarGraphProps> = ({ array, indices, state }) => {
  const maxVal = Math.max(...array, 1);

  const getBarStyle = (index: number): { className: string; shadow?: string } => {
    if (indices.includes(index)) {
      switch (state) {
        case BarState.Compare:
          return { className: 'bg-yellow-400', shadow: '0 0 10px rgba(250, 204, 21, 0.5)' };
        case BarState.Swap:
          return { className: 'bg-red-500', shadow: '0 0 10px rgba(239, 68, 68, 0.5)' };
        case BarState.Overwrite:
          return { className: 'bg-orange-400', shadow: '0 0 10px rgba(251, 146, 60, 0.5)' };
        case BarState.Sorted:
          return { className: 'bg-sky-400', shadow: '0 0 10px rgba(56, 189, 248, 0.4)' };
        default:
          return { className: 'bg-[#03A63C]' };
      }
    }
    return { className: 'bg-[#03A63C]/50 hover:bg-[#03A63C]/70 transition-colors duration-150' };
  };

  return (
    <div className="relative w-full h-[420px] px-4 pb-3 pt-12 bg-[#012340]/80 rounded-2xl border border-[#027333]/30">
      <div className="flex items-end w-full h-full gap-[1px] md:gap-[2px]">
        {array.map((value, idx) => {
          const { className, shadow } = getBarStyle(idx);
          return (
            <div
              key={idx}
              className={`flex-1 rounded-t-sm ${className}`}
              style={{
                height: `${(value / maxVal) * 100}%`,
                transition: 'height 0.08s ease-out',
                boxShadow: shadow || 'none'
              }}
              title={`Value: ${value}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BarGraph;
