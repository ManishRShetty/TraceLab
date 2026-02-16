import React from 'react';
import { Play, Pause, RotateCcw, FastForward, ChevronDown } from 'lucide-react';
import { AlgorithmType } from '../types';

interface ControlsProps {
  algorithm: AlgorithmType;
  setAlgorithm: (algo: AlgorithmType) => void;
  isRunning: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  arraySize: number;
  setArraySize: (size: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  isSorted: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  algorithm,
  setAlgorithm,
  isRunning,
  onPlay,
  onPause,
  onReset,
  arraySize,
  setArraySize,
  speed,
  setSpeed,
  isSorted
}) => {
  return (
    <div className="w-full bg-white/[0.04] backdrop-blur-sm p-4 md:px-6 md:py-4 rounded-2xl border border-white/[0.06] shadow-xl">
      {/* Single Row: [Dropdown] [Buttons] [Sliders] */}
      <div className="flex flex-col md:flex-row items-center gap-4">

        {/* Algorithm Selector */}
        <div className="relative shrink-0 w-full md:w-48">
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
            disabled={isRunning}
            className="w-full bg-[#012340] text-white border border-white/10 rounded-xl px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#04D939]/40 disabled:opacity-50 transition-all text-sm font-semibold"
          >
            {Object.values(AlgorithmType).map((algo) => (
              <option key={algo} value={algo}>{algo}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#03A63C]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onReset}
            className="p-2.5 rounded-xl bg-[#012340] hover:bg-[#027333] text-white transition-all duration-200 active:scale-95 border border-white/10"
            title="Generate New Array"
            disabled={isRunning}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={isRunning ? onPause : onPlay}
            disabled={isSorted && !isRunning}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${isSorted
                ? 'bg-sky-500 text-white cursor-not-allowed opacity-70'
                : isRunning
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-[#012340]'
                  : 'bg-[#04D939] text-[#012340] neon-glow hover:brightness-110'
              }`}
          >
            {isRunning ? (
              <><Pause className="w-4 h-4" /> Pause</>
            ) : (
              <><Play className="w-4 h-4" /> {isSorted ? 'Done' : 'Start'}</>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-white/10"></div>

        {/* Size Slider */}
        <div className="flex-1 w-full min-w-0 space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-white/35 uppercase tracking-widest font-semibold">Size</span>
            <span className="text-xs font-bold text-[#04D939] tabular-nums">{arraySize}</span>
          </div>
          <input
            type="range" min="10" max="100" step="5"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={isRunning}
            className="w-full h-1"
          />
        </div>

        {/* Speed Slider */}
        <div className="flex-1 w-full min-w-0 space-y-1">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] text-white/35 uppercase tracking-widest font-semibold">Speed</span>
            <span className="text-xs font-bold text-[#04D939] tabular-nums flex items-center gap-1">
              {speed}ms <FastForward className="w-3 h-3 text-white/25" />
            </span>
          </div>
          <input
            type="range" min="1" max="500" step="10"
            value={501 - speed}
            onChange={(e) => setSpeed(501 - Number(e.target.value))}
            className="w-full h-1"
          />
        </div>
      </div>
    </div>
  );
};

export default Controls;
