import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlgorithmType, AlgorithmInfo, BarState, SortStep } from './types';
import { sortingAlgorithms } from './services/sortingAlgorithms';
import BarGraph from './components/BarGraph';
import Controls from './components/Controls';
import ComplexityInfo from './components/ComplexityInfo';
import { Activity } from 'lucide-react';
import Aurora from './components/Aurora';
import Footer from './components/Footer';

// Static Data for algorithms
const ALGORITHM_DATA: Record<AlgorithmType, AlgorithmInfo> = {
  [AlgorithmType.BubbleSort]: {
    name: AlgorithmType.BubbleSort,
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    algorithm: [
      'procedure bubbleSort(arr, n)',
      '  for i = 0 to n-1',
      '    swapped = false',
      '    for j = 0 to n-i-2',
      '      if arr[j] > arr[j+1]',
      '        swap(arr[j], arr[j+1])',
      '        swapped = true',
      '    if not swapped',
      '      break  // already sorted',
    ]
  },
  [AlgorithmType.SelectionSort]: {
    name: AlgorithmType.SelectionSort,
    timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Divides the input list into two parts: a sorted sublist of items which is built up from left to right at the front (left) of the list and a sublist of the remaining unsorted items.',
    algorithm: [
      'procedure selectionSort(arr, n)',
      '  for i = 0 to n-1',
      '    minIdx = i',
      '    for j = i+1 to n-1',
      '      if arr[j] < arr[minIdx]',
      '        minIdx = j',
      '    if minIdx != i',
      '      swap(arr[i], arr[minIdx])',
    ]
  },
  [AlgorithmType.InsertionSort]: {
    name: AlgorithmType.InsertionSort,
    timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    description: 'Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
    algorithm: [
      'procedure insertionSort(arr, n)',
      '  for i = 1 to n-1',
      '    key = arr[i]',
      '    j = i - 1',
      '    while j >= 0 and arr[j] > key',
      '      arr[j+1] = arr[j]',
      '      j = j - 1',
      '    arr[j+1] = key',
    ]
  },
  [AlgorithmType.MergeSort]: {
    name: AlgorithmType.MergeSort,
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    description: 'A divide and conquer algorithm that divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
    algorithm: [
      'procedure mergeSort(arr, l, r)',
      '  if l < r',
      '    mid = floor((l + r) / 2)',
      '    mergeSort(arr, l, mid)',
      '    mergeSort(arr, mid+1, r)',
      '    merge left[l..mid], right[mid+1..r]',
      '      while both halves have elements',
      '        pick smaller, place in arr[k]',
      '      copy remaining elements',
    ]
  },
  [AlgorithmType.QuickSort]: {
    name: AlgorithmType.QuickSort,
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    description: 'An efficient, in-place sorting algorithm that in practice is faster than MergeSort and HeapSort. It works by selecting a "pivot" element and partitioning the other elements into two sub-arrays.',
    algorithm: [
      'procedure quickSort(arr, lo, hi)',
      '  if lo < hi',
      '    pivot = arr[hi]',
      '    i = lo - 1',
      '    for j = lo to hi-1',
      '      if arr[j] < pivot',
      '        i++; swap(arr[i], arr[j])',
      '    swap(arr[i+1], arr[hi])',
      '    p = i + 1',
      '    quickSort(arr, lo, p-1)',
      '    quickSort(arr, p+1, hi)',
    ]
  },
  [AlgorithmType.HeapSort]: {
    name: AlgorithmType.HeapSort,
    timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    description: 'A comparison-based sorting algorithm. Heapsort can be thought of as an improved selection sort: like selection sort, heapsort divides its input into a sorted and an unsorted region.',
    algorithm: [
      'procedure heapSort(arr, n)',
      '  // Build max heap',
      '  for i = n/2-1 down to 0',
      '    heapify(arr, n, i)',
      '  // Extract elements',
      '  for i = n-1 down to 1',
      '    swap(arr[0], arr[i])',
      '    heapify(arr, i, 0)',
      'procedure heapify(arr, n, i)',
      '  largest = max(i, left, right)',
      '  if largest != i',
      '    swap and recurse',
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
        <motion.header
          initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-6 text-center space-y-2"
        >
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#03A63C] to-[#04D939] bg-clip-text text-transparent tracking-tight">
            TraceLab
          </h1>
          <p className="text-white/40 text-sm md:text-base font-light tracking-wide">Interactive Sorting Visualizer & Complexity Analyzer</p>
        </motion.header>

        <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-5">

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
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
          </motion.div>

          {/* Visualization Area */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1 min-h-[400px] flex flex-col relative bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-3 md:p-6 shadow-2xl"
          >
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="mt-5 flex flex-wrap justify-center gap-5 text-xs md:text-sm font-medium text-white/50"
            >
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#03A63C]/50 rounded-sm"></div> Default</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400 rounded-sm"></div> Compare</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Swap</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-400 rounded-sm"></div> Overwrite</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-sky-400 rounded-sm"></div> Sorted</div>
            </motion.div>
          </motion.div>

          {/* Complexity & AI Section */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <ComplexityInfo info={ALGORITHM_DATA[algorithm]} currentState={barState} stepCount={stepCount} />
          </motion.div>

        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;