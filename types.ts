export enum AlgorithmType {
  BubbleSort = 'Bubble Sort',
  SelectionSort = 'Selection Sort',
  InsertionSort = 'Insertion Sort',
  MergeSort = 'Merge Sort',
  QuickSort = 'Quick Sort',
  HeapSort = 'Heap Sort'
}

export enum BarState {
  Default = 'default',
  Compare = 'compare',
  Swap = 'swap',
  Overwrite = 'overwrite',
  Sorted = 'sorted'
}

export interface SortStep {
  array: number[];
  indices: number[]; // Indices involved in the current step
  state: BarState;
  description?: string;
}

export interface AlgorithmInfo {
  name: AlgorithmType;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  description: string;
  algorithm: string[];
}

export interface ComplexityAnalysisResponse {
  analysis: string;
}
