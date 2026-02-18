import React from 'react';
import { CellState } from '../types';

interface SearchBarGraphProps {
    array: number[];
    indices: number[];
    state: CellState;
    target: number;
    eliminatedSet: Set<number>;
    foundIndex: number | null;
}

const SearchBarGraph: React.FC<SearchBarGraphProps> = ({ array, indices, state, target, eliminatedSet, foundIndex }) => {

    const getCellStyle = (index: number): { bg: string; text: string; shadow: string; scale: string; border: string } => {
        // Found state takes priority
        if (foundIndex === index) {
            return {
                bg: 'bg-[#04D939]',
                text: 'text-[#012340] font-black',
                shadow: '0 0 20px rgba(4, 217, 57, 0.6), 0 0 40px rgba(4, 217, 57, 0.3)',
                scale: 'scale-110',
                border: 'border-[#04D939]'
            };
        }

        // Active indices being checked
        if (indices.includes(index)) {
            switch (state) {
                case CellState.Checking:
                    return {
                        bg: 'bg-yellow-400/90',
                        text: 'text-[#012340] font-bold',
                        shadow: '0 0 12px rgba(250, 204, 21, 0.5)',
                        scale: 'scale-105',
                        border: 'border-yellow-400'
                    };
                case CellState.Found:
                    return {
                        bg: 'bg-[#04D939]',
                        text: 'text-[#012340] font-black',
                        shadow: '0 0 20px rgba(4, 217, 57, 0.6), 0 0 40px rgba(4, 217, 57, 0.3)',
                        scale: 'scale-110',
                        border: 'border-[#04D939]'
                    };
                case CellState.Eliminated:
                    return {
                        bg: 'bg-red-500/30',
                        text: 'text-red-300/60 font-medium',
                        shadow: 'none',
                        scale: 'scale-95',
                        border: 'border-red-500/30'
                    };
                default:
                    return {
                        bg: 'bg-[#03A63C]/20',
                        text: 'text-white/70 font-medium',
                        shadow: 'none',
                        scale: 'scale-100',
                        border: 'border-white/10'
                    };
            }
        }

        // Previously eliminated cells
        if (eliminatedSet.has(index)) {
            return {
                bg: 'bg-white/[0.02]',
                text: 'text-white/20 font-normal',
                shadow: 'none',
                scale: 'scale-100',
                border: 'border-white/[0.04]'
            };
        }

        // Default cells
        return {
            bg: 'bg-[#03A63C]/15',
            text: 'text-white/70 font-medium',
            shadow: 'none',
            scale: 'scale-100',
            border: 'border-[#03A63C]/20'
        };
    };

    return (
        <div className="relative w-full min-h-[300px] px-4 pb-3 pt-16 bg-[#012340]/80 rounded-2xl border border-[#027333]/30 flex flex-col items-center justify-center">
            {/* Target Display */}
            <div className="absolute top-4 right-6 z-10 glass px-4 py-2 rounded-full flex items-center gap-2">
                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">Target</span>
                <span className="text-lg font-mono font-black text-[#04D939]">{target}</span>
            </div>

            {/* Array Grid */}
            <div className="w-full flex flex-wrap items-center justify-center gap-1.5 md:gap-2 p-4">
                {array.map((value, idx) => {
                    const style = getCellStyle(idx);
                    return (
                        <div
                            key={idx}
                            className={`
                relative flex flex-col items-center justify-center
                w-10 h-12 md:w-12 md:h-14 rounded-lg border
                ${style.bg} ${style.border} ${style.scale}
                transition-all duration-200 ease-out
              `}
                            style={{ boxShadow: style.shadow }}
                        >
                            <span className={`text-sm md:text-base font-mono ${style.text}`}>
                                {value}
                            </span>
                            <span className="text-[8px] text-white/20 font-mono absolute bottom-0.5">
                                {idx}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs md:text-sm font-medium text-white/50">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#03A63C]/30 rounded-sm border border-[#03A63C]/30"></div> Default</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded-sm"></div> Checking</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#04D939] rounded-sm"></div> Found</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white/[0.04] rounded-sm border border-white/10"></div> Eliminated</div>
            </div>
        </div>
    );
};

export default SearchBarGraph;
