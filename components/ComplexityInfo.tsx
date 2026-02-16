import React, { useState } from 'react';
import { AlgorithmInfo, AlgorithmType, BarState } from '../types';
import { getAlgorithmComplexityAnalysis } from '../services/geminiService';
import { BrainCircuit, Loader2, Clock, HardDrive, Code2, ChevronDown, Hash } from 'lucide-react';

interface ComplexityInfoProps {
  info: AlgorithmInfo;
  currentState: BarState;
  stepCount: number;
}

const getActiveLine = (algo: AlgorithmType, state: BarState): number | null => {
  const lineMap: Record<string, Partial<Record<BarState, number>>> = {
    [AlgorithmType.BubbleSort]: {
      [BarState.Compare]: 4, // if arr[j] > arr[j+1]
      [BarState.Swap]: 5,    // swap(arr[j], arr[j+1])
    },
    [AlgorithmType.SelectionSort]: {
      [BarState.Compare]: 4, // if arr[j] < arr[minIdx]
      [BarState.Overwrite]: 5, // minIdx = j
      [BarState.Swap]: 7,    // swap(arr[i], arr[minIdx])
    },
    [AlgorithmType.InsertionSort]: {
      [BarState.Compare]: 4, // while j >= 0 and arr[j] > key
      [BarState.Overwrite]: 5, // arr[j+1] = arr[j]
    },
    [AlgorithmType.MergeSort]: {
      [BarState.Compare]: 1, // if l < r
      [BarState.Overwrite]: 7, // pick smaller, place in arr[k]
    },
    [AlgorithmType.QuickSort]: {
      [BarState.Compare]: 5, // if arr[j] < pivot
      [BarState.Swap]: 6,    // i++; swap(arr[i], arr[j])
    },
    [AlgorithmType.HeapSort]: {
      [BarState.Compare]: 9, // largest = max(i, left, right)
      [BarState.Swap]: 6,    // swap(arr[0], arr[i])
    },
  };
  return lineMap[algo]?.[state] ?? null;
};

const colorizeCode = (line: string): React.ReactNode => {
  const keywords = ['for', 'if', 'while', 'to', 'and', 'return'];
  const functions = ['swap', 'merge', 'mergeSort', 'quickSort', 'partition', 'buildMaxHeap', 'heapify'];
  const parts = line.split(/(\b\w+\b)/g);
  return parts.map((part, i) => {
    if (keywords.includes(part)) return <span key={i} className="text-yellow-400 font-semibold">{part}</span>;
    if (functions.includes(part)) return <span key={i} className="text-sky-400 font-semibold">{part}</span>;
    if (/^\d+$/.test(part)) return <span key={i} className="text-orange-300">{part}</span>;
    return <span key={i}>{part}</span>;
  });
};

const ComplexityInfo: React.FC<ComplexityInfoProps> = ({ info, currentState, stepCount }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const handleAskAI = async () => {
    setShowAI(true);
    setLoading(true);
    const result = await getAlgorithmComplexityAnalysis(info.name);
    setAnalysis(result);
    setLoading(false);
  };

  React.useEffect(() => {
    setAnalysis(null);
    setShowAI(false);
  }, [info.name]);

  const activeLine = getActiveLine(info.name, currentState);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* Title Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{info.name}</h2>
          <span className="text-xs font-medium text-[#03A63C] tracking-wide uppercase">Overview</span>
        </div>
        <div className="flex items-center gap-2 bg-[#091f2c] px-3 py-1.5 rounded-xl border border-white/[0.08]">
          <Hash className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-[10px] text-white/35 uppercase tracking-wider font-semibold">Ops</span>
          <span className="font-mono text-base font-bold text-white tabular-nums">{stepCount}</span>
        </div>
      </div>

      {/* Description — brighter and larger */}
      <p className="text-white/70 text-sm md:text-base leading-relaxed">{info.description}</p>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

        {/* Time Complexity */}
        <div className="bg-[#091f2c] p-5 rounded-2xl border border-white/[0.08]">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#03A63C]" />
            <h3 className="text-[#03A63C] text-xs uppercase tracking-widest font-semibold">Time</h3>
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">Best</span>
              <span className="font-mono text-[#04D939] text-base font-semibold">{info.timeComplexity.best}</span>
            </div>
            <div className="w-full h-px bg-white/[0.06]"></div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">Avg</span>
              <span className="font-mono text-yellow-400 text-base font-semibold">{info.timeComplexity.average}</span>
            </div>
            <div className="w-full h-px bg-white/[0.06]"></div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300 text-sm">Worst</span>
              <span className="font-mono text-red-400 text-base font-semibold">{info.timeComplexity.worst}</span>
            </div>
          </div>
        </div>

        {/* Space Complexity */}
        <div className="bg-[#091f2c] p-5 rounded-2xl border border-white/[0.08] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-4 h-4 text-[#03A63C]" />
            <h3 className="text-[#03A63C] text-xs uppercase tracking-widest font-semibold">Space</h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="font-mono text-4xl font-bold text-white">{info.spaceComplexity}</span>
          </div>
          <p className="text-slate-400 text-xs text-center mt-2">Worst Case</p>
        </div>

        {/* Algorithm — larger code */}
        <div className="bg-[#0d1117] p-5 rounded-2xl border border-white/[0.08]">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4 text-[#03A63C]" />
            <h3 className="text-[#03A63C] text-xs uppercase tracking-widest font-semibold">Algorithm</h3>
          </div>
          <div className="bg-[#010409] rounded-xl border border-white/[0.06] overflow-hidden">
            {info.algorithm.map((line, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 px-4 py-2 font-mono text-[13px] transition-all duration-200 ${activeLine === idx
                  ? 'bg-yellow-400/15 border-l-2 border-yellow-400'
                  : 'border-l-2 border-transparent'
                  }`}
              >
                <span className="text-white/15 text-xs w-4 text-right select-none">{idx + 1}</span>
                <span className={`whitespace-pre ${activeLine === idx ? 'text-white' : 'text-white/60'}`}>
                  {colorizeCode(line)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Analysis — Collapsed */}
      {!showAI ? (
        <button
          onClick={handleAskAI}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/[0.06] transition-all duration-200 group"
        >
          <BrainCircuit className="w-4 h-4 text-[#03A63C] group-hover:text-[#04D939] transition-colors" />
          <span className="text-white/40 group-hover:text-white/60 text-sm font-medium transition-colors">AI Analysis</span>
          <ChevronDown className="w-3.5 h-3.5 text-white/25 group-hover:text-white/40 transition-colors" />
        </button>
      ) : (
        <div className="bg-[#091f2c] p-5 rounded-2xl border border-white/[0.08]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#03A63C]" />
              AI Analysis
            </h2>
            <button
              onClick={() => { setShowAI(false); setAnalysis(null); }}
              className="text-white/25 hover:text-white/50 text-xs font-medium transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            >
              Collapse
            </button>
          </div>
          <div className="bg-[#012340]/60 rounded-xl p-4 border border-white/[0.04] overflow-y-auto max-h-[250px]">
            {loading ? (
              <div className="flex items-center justify-center h-16 text-white/40 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#04D939]" />
                <span className="text-sm">Analyzing {info.name}...</span>
              </div>
            ) : analysis ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{
                  __html: analysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }} />
              </div>
            ) : (
              <div className="h-16 flex items-center justify-center text-white/25 text-sm">
                <p>Analysis will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplexityInfo;
