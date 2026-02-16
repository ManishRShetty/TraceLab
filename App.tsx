import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlgorithmType, AlgorithmInfo, BarState, SortStep } from './types';
import { sortingAlgorithms } from './services/sortingAlgorithms';
import BarGraph from './components/BarGraph';
import Controls from './components/Controls';
import ComplexityInfo from './components/ComplexityInfo';
import { Activity } from 'lucide-react';
import Aurora from './components/Aurora';

// Static Data for algorithms
const ALGORITHM_DATA: Record<AlgorithmType, AlgorithmInfo> = {
  [AlgorithmType.BubbleSort]: {
    name: AlgorithmType.BubbleSort,
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    algorithm: [
      'for i = 0 to n-1',
      '  for j = 0 to n-i-1',
      '    if arr[j] > arr[j+1]',
      '      swap(arr[j], arr[j+1])',
    ]
  },
  [AlgorithmType.SelectionSort]: {
    name: AlgorithmType.SelectionSort,
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items.',
    algorithm: [
      'for i = 0 to n-1',
      '  min = i',
      '  for j = i+1 to n',
      '    if arr[j] < arr[min]',
      '      min = j',
      '  swap(arr[i], arr[min])',
    ]
  },
  [AlgorithmType.InsertionSort]: {
    name: AlgorithmType.InsertionSort,
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
    algorithm: [
      'for i = 1 to n',
      '  key = arr[i]',
      '  j = i - 1',
      '  while j >= 0 and arr[j] > key',
      '    arr[j+1] = arr[j]',
      '    j = j - 1',
      '  arr[j+1] = key',
    ]
  },
  [AlgorithmType.MergeSort]: {
    name: AlgorithmType.MergeSort,
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    description: 'A divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
    algorithm: [
      'mergeSort(arr, l, r)',
      '  if l < r',
      '    mid = (l + r) / 2',
      '    mergeSort(arr, l, mid)',
      '    mergeSort(arr, mid+1, r)',
      '    merge(arr, l, mid, r)',
    ]
  },
  [AlgorithmType.QuickSort]: {
    name: AlgorithmType.QuickSort,
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    description: 'An efficient, in-place sorting algorithm that in practice is faster than MergeSort and HeapSort. It works by selecting a "pivot" element and partitioning the other elements into two sub-arrays.',
    algorithm: [
      'quickSort(arr, lo, hi)',
      '  if lo < hi',
      '    pivot = partition(arr, lo, hi)',
      '    quickSort(arr, lo, pivot-1)',
      '    quickSort(arr, pivot+1, hi)',
    ]
  },
  [AlgorithmType.HeapSort]: {
    name: AlgorithmType.HeapSort,
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    description: 'A comparison-based sorting algorithm. Heapsort can be thought of as an improved selection sort: like selection sort, heapsort divides its input into a sorted and an unsorted region.',
    algorithm: [
      'buildMaxHeap(arr)',
      'for i = n-1 to 1',
      '  swap(arr[0], arr[i])',
      '  heapify(arr, 0, i)',
    ]
  }
};

const App: React.FC = () => {
  // State
  const [array, setArray] = useState<number[]>([]);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>(AlgorithmType.BubbleSort);
  const [arraySize, setArraySize] = useState<number>(50);
  const [speed, setSpeed] = useState<number>(50);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSorted, setIsSorted] = useState<boolean>(false);

  // Animation State
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [barState, setBarState] = useState<BarState>(BarState.Default);
  const [stepDescription, setStepDescription] = useState<string>('Ready to sort');
  const [stepCount, setStepCount] = useState<number>(0);

  // Refs for generator control
  const generatorRef = useRef<Generator<SortStep> | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random array
  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 100) + 5
    );
    setArray(newArray);
    setIsSorted(false);
    setActiveIndices([]);
    setBarState(BarState.Default);
    setStepDescription('Ready to sort');
    setStepCount(0);
    generatorRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
  }, [arraySize]);

  // Initial load
  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Handle Algorithm Change
  const handleAlgorithmChange = (algo: AlgorithmType) => {
    setAlgorithm(algo);
    generateArray(); // Reset array to ensure fair start
  };

  // Step function
  const step = () => {
    if (!generatorRef.current) {
      // Initialize generator based on selected algorithm
      switch (algorithm) {
        case AlgorithmType.BubbleSort:
          generatorRef.current = sortingAlgorithms.bubbleSort(array);
          break;
        case AlgorithmType.SelectionSort:
          generatorRef.current = sortingAlgorithms.selectionSort(array);
          break;
        case AlgorithmType.InsertionSort:
          generatorRef.current = sortingAlgorithms.insertionSort(array);
          break;
        case AlgorithmType.MergeSort:
          generatorRef.current = sortingAlgorithms.mergeSort(array);
          break;
        case AlgorithmType.QuickSort:
          generatorRef.current = sortingAlgorithms.quickSort(array);
          break;
        case AlgorithmType.HeapSort:
          generatorRef.current = sortingAlgorithms.heapSort(array);
          break;
      }
    }

    const next = generatorRef.current?.next();

    if (next && !next.done) {
      const { array: newArray, indices, state, description } = next.value;
      setArray(newArray);
      setActiveIndices(indices);
      setBarState(state);
      setStepDescription(description || 'Sorting...');
      setStepCount(prev => prev + 1);
    } else {
      // Finished
      setIsRunning(false);
      setIsSorted(true);
      setActiveIndices([]);
      setBarState(BarState.Sorted);
      setStepDescription('Sorting Complete!');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Play handler
  const handlePlay = () => {
    setIsRunning(true);
  };

  // Pause handler
  const handlePause = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Animation Loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        step();
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, speed]); // We intentionally omit 'array' and others to avoid reseting interval on state change, generator handles state

  return (
    <div className="min-h-screen bg-[#012340] text-white relative overflow-hidden">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0 opacity-40">
        <Aurora
          colorStops={['#012340', '#03A63C', '#04D939']}
          amplitude={1.2}
          blend={0.6}
          speed={0.3}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen p-4 md:p-8 lg:p-12 flex flex-col">
        {/* Header */}
        <header className="mb-6 text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#03A63C] to-[#04D939] bg-clip-text text-transparent tracking-tight">
            TraceLab
          </h1>
          <p className="text-white/40 text-sm md:text-base font-light tracking-wide">Interactive Sorting Visualizer & Complexity Analyzer</p>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-5">

          {/* Controls */}
          <Controls
            algorithm={algorithm}
            setAlgorithm={handleAlgorithmChange}
            isRunning={isRunning}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={generateArray}
            arraySize={arraySize}
            setArraySize={setArraySize}
            speed={speed}
            setSpeed={setSpeed}
            isSorted={isSorted}
          />

          {/* Visualization Area */}
          <div className="flex-1 min-h-[400px] flex flex-col relative bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-3 md:p-6 shadow-2xl">
            {/* Status Badge */}
            <div className="absolute top-4 left-6 z-10 glass px-4 py-2 rounded-full flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#04D939]" />
              <span className="text-sm font-mono text-[#04D939]">{stepDescription}</span>
            </div>

            <BarGraph
              array={array}
              indices={activeIndices}
              state={barState}
            />

            {/* Color Legend */}
            <div className="mt-5 flex flex-wrap justify-center gap-5 text-xs md:text-sm font-medium text-white/50">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#03A63C]/50 rounded-sm"></div> Default</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded-sm"></div> Compare</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Swap</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-400 rounded-sm"></div> Overwrite</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-sky-400 rounded-sm"></div> Sorted</div>
            </div>
          </div>

          {/* Complexity & AI Section */}
          <ComplexityInfo info={ALGORITHM_DATA[algorithm]} currentState={barState} stepCount={stepCount} />

        </main>

        <footer className="mt-10 text-center text-white/15 text-xs font-light">
          <p>© 2024 TraceLab. Built with React & Tailwind.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;