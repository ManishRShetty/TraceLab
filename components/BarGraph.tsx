import React from 'react';
import { BarState } from '../types';

interface BarGraphProps {
  array: number[];
  indices: number[];
  state: BarState;
}

const BarGraph: React.FC<BarGraphProps> = ({ array, indices, state }) => {
  // Calculate max value for normalization height
  const maxVal = Math.max(...array, 1);

  const getBarColor = (index: number) => {
    // Sorted state overrides everything else if the whole array is sorted (handled by parent logic usually, 
    // but here we check if the specific index is marked as sorted in a partial sort)
    // However, the `indices` prop usually indicates active elements. 
    // If state is Sorted, usually indices is empty (all sorted) or contains the sorted ones.

    // Check if this index is one of the active indices
    if (indices.includes(index)) {
      switch (state) {
        case BarState.Compare: return 'bg-yellow-400 box-shadow-[0_0_10px_rgba(250,204,21,0.5)]';
        case BarState.Swap: return 'bg-red-500 box-shadow-[0_0_10px_rgba(239,68,68,0.5)]';
        case BarState.Overwrite: return 'bg-purple-500';
        case BarState.Sorted: return 'bg-green-500';
        default: return 'bg-cyan-400';
      }
    }

    // Visual tweak: if the algorithm signals "Sorted" state with empty indices, usually means "Done".
    // But specific algos yield specific sorted indices.
    // We will rely on the parent to pass the full sorted array color if done.
    // For now, default inactive bars.
    return 'bg-cyan-600/80 hover:bg-cyan-500 transition-colors';
  };

  return (
    <div className="relative w-full h-[400px] p-4 bg-slate-900 rounded-lg shadow-inner border border-slate-800">
      <div className="flex items-end w-full h-full gap-[1px] md:gap-[2px]">
        {array.map((value, idx) => (
          <div
            key={idx}
            className={`flex-1 rounded-t-sm ${getBarColor(idx)}`}
            style={{
              height: `${(value / maxVal) * 100}%`,
              transition: 'height 0.1s ease-in-out'
            }}
            title={`Value: ${value}`}
          >
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarGraph;
