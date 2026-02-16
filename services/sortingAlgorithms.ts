import { BarState, SortStep } from '../types';

// Helper to yield a step
function createStep(array: number[], indices: number[], state: BarState, description: string): SortStep {
  return {
    array: [...array], // Create a copy
    indices,
    state,
    description
  };
}

export const sortingAlgorithms = {
  *bubbleSort(array: number[]): Generator<SortStep> {
    const arr = [...array];
    const n = arr.length;
    let swapped;

    for (let i = 0; i < n - 1; i++) {
      swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        yield createStep(arr, [j, j + 1], BarState.Compare, `Comparing index ${j} and ${j + 1}`);
        
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          yield createStep(arr, [j, j + 1], BarState.Swap, `Swapping index ${j} and ${j + 1}`);
          swapped = true;
        }
      }
      // Mark the end element as sorted
      yield createStep(arr, [n - 1 - i], BarState.Sorted, `Index ${n - 1 - i} is sorted`);
      if (!swapped) break;
    }
    // Mark remaining as sorted
    yield createStep(arr, [], BarState.Sorted, 'Array is sorted');
  },

  *selectionSort(array: number[]): Generator<SortStep> {
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        yield createStep(arr, [minIdx, j], BarState.Compare, `Comparing current min ${minIdx} with ${j}`);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          yield createStep(arr, [minIdx], BarState.Overwrite, `New minimum found at index ${minIdx}`);
        }
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        yield createStep(arr, [i, minIdx], BarState.Swap, `Swapping index ${i} with new min ${minIdx}`);
      }
      yield createStep(arr, [i], BarState.Sorted, `Index ${i} is sorted`);
    }
    yield createStep(arr, [], BarState.Sorted, 'Array is sorted');
  },

  *insertionSort(array: number[]): Generator<SortStep> {
    const arr = [...array];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
      
      yield createStep(arr, [i], BarState.Compare, `Selected key at index ${i}`);

      while (j >= 0 && arr[j] > key) {
        yield createStep(arr, [j, j + 1], BarState.Compare, `Comparing key with ${j}`);
        arr[j + 1] = arr[j];
        yield createStep(arr, [j, j + 1], BarState.Overwrite, `Moving value from ${j} to ${j + 1}`);
        j = j - 1;
      }
      arr[j + 1] = key;
      yield createStep(arr, [j + 1], BarState.Overwrite, `Inserted key at ${j + 1}`);
    }
    yield createStep(arr, [], BarState.Sorted, 'Array is sorted');
  },

  *mergeSort(array: number[]): Generator<SortStep> {
    const arr = [...array];
    
    function* merge(start: number, mid: number, end: number): Generator<SortStep> {
      const left = arr.slice(start, mid + 1);
      const right = arr.slice(mid + 1, end + 1);
      
      let i = 0, j = 0, k = start;
      
      while (i < left.length && j < right.length) {
        // Visualizing comparison requires mapping back to original indices approximately
        yield createStep(arr, [start + i, mid + 1 + j], BarState.Compare, `Comparing subarrays`);
        
        if (left[i] <= right[j]) {
          arr[k] = left[i];
          yield createStep(arr, [k], BarState.Overwrite, `Overwriting index ${k} with value from left subarray`);
          i++;
        } else {
          arr[k] = right[j];
          yield createStep(arr, [k], BarState.Overwrite, `Overwriting index ${k} with value from right subarray`);
          j++;
        }
        k++;
      }
      
      while (i < left.length) {
        arr[k] = left[i];
        yield createStep(arr, [k], BarState.Overwrite, `Flushing left subarray to ${k}`);
        i++;
        k++;
      }
      
      while (j < right.length) {
        arr[k] = right[j];
        yield createStep(arr, [k], BarState.Overwrite, `Flushing right subarray to ${k}`);
        j++;
        k++;
      }
    }

    function* mergeSortHelper(start: number, end: number): Generator<SortStep> {
      if (start >= end) return;
      
      const mid = Math.floor((start + end) / 2);
      yield* mergeSortHelper(start, mid);
      yield* mergeSortHelper(mid + 1, end);
      yield* merge(start, mid, end);
    }

    yield* mergeSortHelper(0, arr.length - 1);
    yield createStep(arr, [], BarState.Sorted, 'Array is sorted');
  },

  *quickSort(array: number[]): Generator<SortStep> {
    const arr = [...array];

    function* partition(low: number, high: number): Generator<SortStep, number, unknown> {
      const pivot = arr[high];
      yield createStep(arr, [high], BarState.Compare, `Pivot selected at ${high}`);
      
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        yield createStep(arr, [j, high], BarState.Compare, `Comparing ${j} with pivot`);
        
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          yield createStep(arr, [i, j], BarState.Swap, `Swapping ${i} and ${j}`);
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      yield createStep(arr, [i + 1, high], BarState.Swap, `Placing pivot at correct position ${i + 1}`);
      return i + 1;
    }

    function* quickSortHelper(low: number, high: number): Generator<SortStep> {
      if (low < high) {
        // We yield* the partition generator, which yields steps and returns the pivot index.
        const pi = yield* partition(low, high);
        
        yield* quickSortHelper(low, pi - 1);
        yield* quickSortHelper(pi + 1, high);
      }
    }

    yield* quickSortHelper(0, arr.length - 1);
    yield createStep(arr, [], BarState.Sorted, 'Array is sorted');
  },
  
  *heapSort(array: number[]): Generator<SortStep> {
    const arr = [...array];
    const n = arr.length;

    function* heapify(n: number, i: number): Generator<SortStep> {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n) {
        yield createStep(arr, [largest, left], BarState.Compare, `Compare root ${largest} with left ${left}`);
        if (arr[left] > arr[largest]) {
           largest = left;
        }
      }

      if (right < n) {
        yield createStep(arr, [largest, right], BarState.Compare, `Compare largest ${largest} with right ${right}`);
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }

      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        yield createStep(arr, [i, largest], BarState.Swap, `Swap root ${i} with largest ${largest}`);
        yield* heapify(n, largest);
      }
    }

    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      yield* heapify(n, i);
    }

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      yield createStep(arr, [0, i], BarState.Swap, `Move current root to end (index ${i})`);
      yield* heapify(i, 0);
      yield createStep(arr, [i], BarState.Sorted, `Index ${i} is sorted`);
    }
    yield createStep(arr, [0], BarState.Sorted, 'Array is sorted');
  }
};