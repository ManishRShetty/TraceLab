import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Settings2 } from 'lucide-react';
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
    <div className="w-full max-w-6xl mx-auto bg-slate-800 p-4 md:p-6 rounded-xl border border-slate-700 shadow-xl mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Playback Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all active:scale-95"
            title="Generate New Array"
            disabled={isRunning}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <button
            onClick={isRunning ? onPause : onPlay}
            disabled={isSorted && !isRunning}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all active:scale-95 ${
              isSorted 
                ? 'bg-green-600 cursor-not-allowed opacity-80' 
                : isRunning 
                  ? 'bg-amber-500 hover:bg-amber-600' 
                  : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" /> {isSorted ? 'Sorted' : 'Start Sorting'}
              </>
            )}
          </button>
        </div>

        {/* Algorithm Selector */}
        <div className="flex-1 w-full md:w-auto">
          <div className="relative group">
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
              disabled={isRunning}
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {Object.values(AlgorithmType).map((algo) => (
                <option key={algo} value={algo}>{algo}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <Settings2 className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400 uppercase font-semibold">
              <span>Size: {arraySize}</span>
              <span>Speed: {speed}ms</span>
            </div>
            <div className="flex gap-4 items-center">
               <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                disabled={isRunning}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
               <input
                type="range"
                min="1"
                max="500"
                step="10"
                value={501 - speed} // Invert so right is faster
                onChange={(e) => setSpeed(501 - Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
               <span>Adjust Size</span>
               <span className="flex items-center gap-1">Adjust Speed <FastForward className="w-3 h-3"/></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
