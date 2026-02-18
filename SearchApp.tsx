import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SearchAlgorithmType, SearchAlgorithmInfo, CellState, SearchStep } from './types';
import { searchingAlgorithms } from './services/searchingAlgorithms';
import SearchBarGraph from './components/SearchBarGraph';
import SearchControls from './components/SearchControls';
import SearchComplexityInfo from './components/SearchComplexityInfo';
import { Search } from 'lucide-react';
import Aurora from './components/Aurora';
import Footer from './components/Footer';

const SEARCH_ALGORITHM_DATA: Record<SearchAlgorithmType, SearchAlgorithmInfo> = {
    [SearchAlgorithmType.LinearSearch]: {
        name: SearchAlgorithmType.LinearSearch,
        timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
        spaceComplexity: 'O(1)',
        description: 'A simple search algorithm that checks every element in the list sequentially until the desired element is found or the list ends.',
        algorithm: [
            'procedure linearSearch(arr, n, target)',
            '  for i = 0 to n-1',
            '    if arr[i] == target',
            '      return i  // found',
            '    else continue',
            '  return -1  // not found',
        ]
    },
    [SearchAlgorithmType.BinarySearch]: {
        name: SearchAlgorithmType.BinarySearch,
        timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
        spaceComplexity: 'O(1)',
        description: 'An efficient search algorithm that works on sorted arrays by repeatedly dividing the search interval in half.',
        algorithm: [
            'procedure binarySearch(arr, target)',
            '  low = 0, high = n-1',
            '  while low <= high',
            '    mid = floor((low + high) / 2)',
            '    if arr[mid] == target',
            '      return mid',
            '    else if arr[mid] < target',
            '      low = mid + 1',
            '    else',
            '      high = mid - 1',
            '  return -1  // not found',
        ]
    },
    [SearchAlgorithmType.JumpSearch]: {
        name: SearchAlgorithmType.JumpSearch,
        timeComplexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
        spaceComplexity: 'O(1)',
        description: 'Works on sorted arrays by jumping ahead by fixed steps (√n) and then performing a linear search within the identified block.',
        algorithm: [
            'procedure jumpSearch(arr, n, target)',
            '  step = floor(sqrt(n))',
            '  prev = 0',
            '  while arr[min(step,n)-1] < target',
            '    prev = step',
            '    step += floor(sqrt(n))',
            '    if prev >= n: return -1',
            '  for i = prev to min(step, n)',
            '    if arr[i] == target',
            '      return i',
            '  return -1  // not found',
        ]
    },
    [SearchAlgorithmType.ExponentialSearch]: {
        name: SearchAlgorithmType.ExponentialSearch,
        timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
        spaceComplexity: 'O(1)',
        description: 'Finds the range where the element may be present by exponentially increasing the index, then performs binary search within that range.',
        algorithm: [
            'procedure exponentialSearch(arr, n, target)',
            '  if arr[0] == target: return 0',
            '  bound = 1',
            '  while bound < n and arr[bound] <= target',
            '    bound *= 2',
            '  binarySearch(arr, bound/2, min(bound,n-1))',
            '    // standard binary search',
            '    // in the identified range',
            '  return index or -1',
        ]
    }
};

const SearchApp: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [array, setArray] = useState<number[]>([]);
    const [algorithm, setAlgorithm] = useState<SearchAlgorithmType>(SearchAlgorithmType.LinearSearch);
    const [arraySize, setArraySize] = useState<number>(20);
    const [speed, setSpeed] = useState<number>(200);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isDone, setIsDone] = useState<boolean>(false);
    const [isFound, setIsFound] = useState<boolean>(false);
    const [target, setTarget] = useState<number>(42);

    // Animation State
    const [activeIndices, setActiveIndices] = useState<number[]>([]);
    const [cellState, setCellState] = useState<CellState>(CellState.Default);
    const [stepDescription, setStepDescription] = useState<string>('Ready to search');
    const [stepCount, setStepCount] = useState<number>(0);
    const [eliminatedSet, setEliminatedSet] = useState<Set<number>>(new Set());
    const [foundIndex, setFoundIndex] = useState<number | null>(null);

    const generatorRef = useRef<Generator<SearchStep> | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const needsSortedArray = algorithm !== SearchAlgorithmType.LinearSearch;

    const generateArray = useCallback(() => {
        let newArray: number[];
        if (needsSortedArray) {
            // Generate sorted unique values
            const values = new Set<number>();
            while (values.size < arraySize) {
                values.add(Math.floor(Math.random() * 99) + 1);
            }
            newArray = Array.from(values).sort((a, b) => a - b);
        } else {
            newArray = Array.from({ length: arraySize }, () =>
                Math.floor(Math.random() * 99) + 1
            );
        }

        setArray(newArray);
        // Pick a target that exists ~70% of the time
        if (Math.random() < 0.7) {
            setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
        } else {
            setTarget(Math.floor(Math.random() * 99) + 1);
        }

        setIsDone(false);
        setIsFound(false);
        setActiveIndices([]);
        setCellState(CellState.Default);
        setStepDescription('Ready to search');
        setStepCount(0);
        setEliminatedSet(new Set());
        setFoundIndex(null);
        generatorRef.current = null;
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
    }, [arraySize, needsSortedArray]);

    useEffect(() => {
        generateArray();
    }, [generateArray]);

    const handleAlgorithmChange = (algo: SearchAlgorithmType) => {
        setAlgorithm(algo);
        // Will regenerate array due to needsSortedArray change
    };

    // Re-generate when algorithm changes (sorted requirement may change)
    useEffect(() => {
        generateArray();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [algorithm]);

    const step = () => {
        if (!generatorRef.current) {
            switch (algorithm) {
                case SearchAlgorithmType.LinearSearch:
                    generatorRef.current = searchingAlgorithms.linearSearch(array, target);
                    break;
                case SearchAlgorithmType.BinarySearch:
                    generatorRef.current = searchingAlgorithms.binarySearch(array, target);
                    break;
                case SearchAlgorithmType.JumpSearch:
                    generatorRef.current = searchingAlgorithms.jumpSearch(array, target);
                    break;
                case SearchAlgorithmType.ExponentialSearch:
                    generatorRef.current = searchingAlgorithms.exponentialSearch(array, target);
                    break;
            }
        }

        const next = generatorRef.current?.next();

        if (next && !next.done) {
            const { indices, state, description, foundIndex: fi } = next.value;
            setActiveIndices(indices);
            setCellState(state);
            setStepDescription(description || 'Searching...');
            setStepCount(prev => prev + 1);

            if (state === CellState.Eliminated) {
                setEliminatedSet(prev => {
                    const next = new Set(prev);
                    indices.forEach(i => next.add(i));
                    return next;
                });
            }

            if (state === CellState.Found && fi !== undefined) {
                setFoundIndex(fi);
                setIsFound(true);
                setIsDone(true);
                setIsRunning(false);
                if (timerRef.current) clearInterval(timerRef.current);
            }
        } else {
            // Finished without finding
            setIsRunning(false);
            setIsDone(true);
            if (!isFound) {
                setStepDescription('Target not found in array');
            }
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const handlePlay = () => setIsRunning(true);
    const handlePause = () => {
        setIsRunning(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };

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
    }, [isRunning, speed]);

    return (
        <div className="min-h-screen bg-[#012340] text-white relative overflow-hidden">
            <div className="fixed inset-0 z-0 opacity-40">
                <Aurora
                    colorStops={['#012340', '#03A63C', '#04D939']}
                    amplitude={1.2}
                    blend={0.6}
                    speed={0.3}
                />
            </div>

            <div className="relative z-10 min-h-screen p-4 md:p-8 lg:p-12 flex flex-col">
                <motion.header
                    initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mb-6 text-center space-y-2"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-white bg-gradient-to-r from-[#03A63C] to-[#04D939] bg-clip-text text-transparent tracking-tight">
                        TraceLab
                    </h1>
                    <p className="text-white/40 text-sm md:text-base font-light tracking-wide">Interactive Search Visualizer & Complexity Analyzer</p>
                </motion.header>

                <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-5">

                    <motion.div
                        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        <SearchControls
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
                            isFound={isFound}
                            isDone={isDone}
                            target={target}
                            setTarget={setTarget}
                            maxTarget={99}
                            onBack={onBack}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="flex-1 min-h-[400px] flex flex-col relative bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-3 md:p-6 shadow-2xl"
                    >
                        <div className="absolute top-4 left-6 z-10 glass px-4 py-2 rounded-full flex items-center gap-2">
                            <Search className="w-4 h-4 text-[#04D939]" />
                            <span className="text-sm font-mono text-[#04D939]">{stepDescription}</span>
                        </div>

                        <SearchBarGraph
                            array={array}
                            indices={activeIndices}
                            state={cellState}
                            target={target}
                            eliminatedSet={eliminatedSet}
                            foundIndex={foundIndex}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.6, delay: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        <SearchComplexityInfo info={SEARCH_ALGORITHM_DATA[algorithm]} currentState={cellState} stepCount={stepCount} />
                    </motion.div>

                </main>

                <Footer />
            </div>
        </div>
    );
};

export default SearchApp;
