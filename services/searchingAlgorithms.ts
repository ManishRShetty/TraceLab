import { CellState, SearchStep } from '../types';

function createSearchStep(
    array: number[],
    indices: number[],
    state: CellState,
    description: string,
    foundIndex?: number
): SearchStep {
    return {
        array: [...array],
        indices,
        state,
        description,
        foundIndex
    };
}

export const searchingAlgorithms = {
    *linearSearch(array: number[], target: number): Generator<SearchStep> {
        const arr = [...array];

        for (let i = 0; i < arr.length; i++) {
            yield createSearchStep(arr, [i], CellState.Checking, `Checking index ${i} (value: ${arr[i]})`);

            if (arr[i] === target) {
                yield createSearchStep(arr, [i], CellState.Found, `Found target ${target} at index ${i}!`, i);
                return;
            }

            yield createSearchStep(arr, [i], CellState.Eliminated, `${arr[i]} ≠ ${target}, moving on`);
        }

        yield createSearchStep(arr, [], CellState.Eliminated, `Target ${target} not found in array`);
    },

    *binarySearch(array: number[], target: number): Generator<SearchStep> {
        const arr = [...array];
        let low = 0;
        let high = arr.length - 1;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);

            yield createSearchStep(arr, [low, mid, high], CellState.Checking, `Checking mid=${mid} (value: ${arr[mid]}), range [${low}..${high}]`);

            if (arr[mid] === target) {
                yield createSearchStep(arr, [mid], CellState.Found, `Found target ${target} at index ${mid}!`, mid);
                return;
            } else if (arr[mid] < target) {
                // Eliminate left half
                const eliminated: number[] = [];
                for (let i = low; i <= mid; i++) eliminated.push(i);
                yield createSearchStep(arr, eliminated, CellState.Eliminated, `${arr[mid]} < ${target}, eliminating left half [${low}..${mid}]`);
                low = mid + 1;
            } else {
                // Eliminate right half
                const eliminated: number[] = [];
                for (let i = mid; i <= high; i++) eliminated.push(i);
                yield createSearchStep(arr, eliminated, CellState.Eliminated, `${arr[mid]} > ${target}, eliminating right half [${mid}..${high}]`);
                high = mid - 1;
            }
        }

        yield createSearchStep(arr, [], CellState.Eliminated, `Target ${target} not found in array`);
    },

    *jumpSearch(array: number[], target: number): Generator<SearchStep> {
        const arr = [...array];
        const n = arr.length;
        const step = Math.floor(Math.sqrt(n));
        let prev = 0;
        let curr = step;

        // Jump phase
        while (curr < n && arr[curr] < target) {
            yield createSearchStep(arr, [curr], CellState.Checking, `Jump: checking index ${curr} (value: ${arr[curr]})`);

            // Eliminate the skipped block
            const eliminated: number[] = [];
            for (let i = prev; i < curr; i++) eliminated.push(i);
            yield createSearchStep(arr, eliminated, CellState.Eliminated, `Block [${prev}..${curr - 1}] eliminated, jumping ahead`);

            prev = curr;
            curr += step;
        }

        if (curr >= n) curr = n - 1;
        yield createSearchStep(arr, [curr], CellState.Checking, `Jump landed at index ${curr} (value: ${arr[curr]})`);

        // Linear scan phase
        for (let i = prev; i <= curr && i < n; i++) {
            yield createSearchStep(arr, [i], CellState.Checking, `Linear scan: checking index ${i} (value: ${arr[i]})`);

            if (arr[i] === target) {
                yield createSearchStep(arr, [i], CellState.Found, `Found target ${target} at index ${i}!`, i);
                return;
            }

            if (arr[i] > target) {
                yield createSearchStep(arr, [i], CellState.Eliminated, `${arr[i]} > ${target}, target not in this block`);
                break;
            }

            yield createSearchStep(arr, [i], CellState.Eliminated, `${arr[i]} ≠ ${target}, continue scan`);
        }

        yield createSearchStep(arr, [], CellState.Eliminated, `Target ${target} not found in array`);
    },

    *exponentialSearch(array: number[], target: number): Generator<SearchStep> {
        const arr = [...array];
        const n = arr.length;

        // Check first element
        yield createSearchStep(arr, [0], CellState.Checking, `Checking index 0 (value: ${arr[0]})`);

        if (arr[0] === target) {
            yield createSearchStep(arr, [0], CellState.Found, `Found target ${target} at index 0!`, 0);
            return;
        }

        // Find range with exponential bounds
        let bound = 1;
        while (bound < n && arr[bound] <= target) {
            yield createSearchStep(arr, [bound], CellState.Checking, `Exponential bound: checking index ${bound} (value: ${arr[bound]})`);

            if (arr[bound] === target) {
                yield createSearchStep(arr, [bound], CellState.Found, `Found target ${target} at index ${bound}!`, bound);
                return;
            }

            bound *= 2;
        }

        // Binary search within found range
        let low = Math.floor(bound / 2);
        let high = Math.min(bound, n - 1);

        yield createSearchStep(arr, [low, high], CellState.Checking, `Binary search in range [${low}..${high}]`);

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);

            yield createSearchStep(arr, [low, mid, high], CellState.Checking, `Checking mid=${mid} (value: ${arr[mid]}), range [${low}..${high}]`);

            if (arr[mid] === target) {
                yield createSearchStep(arr, [mid], CellState.Found, `Found target ${target} at index ${mid}!`, mid);
                return;
            } else if (arr[mid] < target) {
                const eliminated: number[] = [];
                for (let i = low; i <= mid; i++) eliminated.push(i);
                yield createSearchStep(arr, eliminated, CellState.Eliminated, `${arr[mid]} < ${target}, eliminating left half`);
                low = mid + 1;
            } else {
                const eliminated: number[] = [];
                for (let i = mid; i <= high; i++) eliminated.push(i);
                yield createSearchStep(arr, eliminated, CellState.Eliminated, `${arr[mid]} > ${target}, eliminating right half`);
                high = mid - 1;
            }
        }

        yield createSearchStep(arr, [], CellState.Eliminated, `Target ${target} not found in array`);
    }
};
