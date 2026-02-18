import React from 'react';
import { Play, Pause, RotateCcw, FastForward, ChevronDown, ArrowLeft } from 'lucide-react';
import { SearchAlgorithmType } from '../types';

interface SearchControlsProps {
    algorithm: SearchAlgorithmType;
    setAlgorithm: (algo: SearchAlgorithmType) => void;
    isRunning: boolean;
    onPlay: () => void;
    onPause: () => void;
    onReset: () => void;
    arraySize: number;
    setArraySize: (size: number) => void;
    speed: number;
    setSpeed: (speed: number) => void;
    isFound: boolean;
    isDone: boolean;
    target: number;
    setTarget: (t: number) => void;
    maxTarget: number;
    onBack: () => void;
}

const SearchControls: React.FC<SearchControlsProps> = ({
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
    isFound,
    isDone,
    target,
    setTarget,
    maxTarget,
    onBack
}) => {
    return (
        <div className="w-full bg-white/[0.04] backdrop-blur-sm p-4 md:px-6 md:py-4 rounded-2xl border border-white/[0.06] shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-4">

                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="p-2.5 rounded-xl bg-[#012340] hover:bg-[#027333] text-white transition-all duration-200 active:scale-95 border border-white/10 shrink-0"
                    title="Back to Home"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>

                {/* Algorithm Selector */}
                <div className="relative shrink-0 w-full md:w-52">
                    <select
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value as SearchAlgorithmType)}
                        disabled={isRunning}
                        className="w-full bg-[#012340] text-white border border-white/10 rounded-xl px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#04D939]/40 disabled:opacity-50 transition-all text-sm font-semibold"
                    >
                        {Object.values(SearchAlgorithmType).map((algo) => (
                            <option key={algo} value={algo}>{algo}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#03A63C]">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>

                {/* Target Input */}
                <div className="shrink-0 flex items-center gap-2">
                    <span className="text-[10px] text-white/35 uppercase tracking-widest font-semibold">Target</span>
                    <input
                        type="number"
                        min={1}
                        max={maxTarget}
                        value={target}
                        onChange={(e) => setTarget(Math.max(1, Math.min(maxTarget, Number(e.target.value))))}
                        disabled={isRunning}
                        className="w-16 bg-[#012340] text-[#04D939] font-mono font-bold border border-white/10 rounded-xl px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#04D939]/40 disabled:opacity-50 text-sm"
                    />
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
                        disabled={isDone && !isRunning}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${isDone
                            ? isFound
                                ? 'bg-[#04D939] text-[#012340] cursor-not-allowed opacity-70'
                                : 'bg-red-400 text-white cursor-not-allowed opacity-70'
                            : isRunning
                                ? 'bg-yellow-400 hover:bg-yellow-500 text-[#012340]'
                                : 'bg-[#04D939] text-[#012340] neon-glow hover:brightness-110'
                            }`}
                    >
                        {isRunning ? (
                            <><Pause className="w-4 h-4" /> Pause</>
                        ) : (
                            <><Play className="w-4 h-4" /> {isDone ? (isFound ? 'Found!' : 'Not Found') : 'Search'}</>
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
                        type="range" min="8" max="40" step="2"
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

export default SearchControls;
