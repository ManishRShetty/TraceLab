import React, { useState } from 'react';
import { AlgorithmInfo, AlgorithmType } from '../types';
import { getAlgorithmComplexityAnalysis } from '../services/geminiService';
import { BrainCircuit, Loader2 } from 'lucide-react';

interface ComplexityInfoProps {
  info: AlgorithmInfo;
}

const ComplexityInfo: React.FC<ComplexityInfoProps> = ({ info }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    setLoading(true);
    const result = await getAlgorithmComplexityAnalysis(info.name);
    setAnalysis(result);
    setLoading(false);
  };

  // Reset analysis when algorithm changes
  React.useEffect(() => {
    setAnalysis(null);
  }, [info.name]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto mt-6">
      {/* Static Info Card */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          {info.name} <span className="text-sm font-normal text-slate-400">Overview</span>
        </h2>
        <p className="text-slate-300 mb-6">{info.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-2">Time Complexity</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-green-400">Best:</span>
                <span className="font-mono text-white">{info.timeComplexity.best}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400">Average:</span>
                <span className="font-mono text-white">{info.timeComplexity.average}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-400">Worst:</span>
                <span className="font-mono text-white">{info.timeComplexity.worst}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-2">Space Complexity</h3>
            <div className="flex justify-between items-center h-full">
              <span className="text-blue-400">Worst:</span>
              <span className="font-mono text-white text-xl">{info.spaceComplexity}</span>
            </div>
          </div>
        </div>

        {/* Algorithm Pseudocode */}
        <div className="mt-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-2">Algorithm</h3>
          <pre className="font-mono text-sm text-cyan-200 leading-relaxed whitespace-pre overflow-x-auto">
            {info.algorithm.join('\n')}
          </pre>
        </div>
      </div>

      {/* AI Analysis Card */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
            AI Analysis
          </h2>
          {!analysis && (
            <button
              onClick={handleAskAI}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
            </button>
          )}
        </div>

        <div className="flex-1 bg-slate-900/50 rounded-lg p-4 border border-slate-700 overflow-y-auto max-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing {info.name}...
            </div>
          ) : analysis ? (
            <div className="prose prose-invert prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{
                __html: analysis.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-center">
              <p>Click "Analyze" to get a detailed breakdown <br />of why this algorithm behaves the way it does.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplexityInfo;
