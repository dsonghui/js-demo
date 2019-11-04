#! /usr/bin/env node

import { ArrData } from './data';
import { makeArr, markTime } from "./helper";

let l = 100000;

function bubble() {
    let arr = makeArr(l);
    let mark1 = markTime('冒泡2开始');
    let time = 0;

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                let older = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = older;
            }
            time++;
        }
    }
    console.log(`循环次数${time}`);
    mark1('冒泡2结束');
}

function insertionSort() {
    let arr = makeArr(l);
    let mark1 = markTime('插入排序开始');
    for (let i = 1; i < arr.length; i++) {
        let nowValue = arr[i];
        let j = i - 1;
        // 前一位比当前位值大的
        while (j >= 0 && arr[j] > nowValue) {
            // 往后移动一位
            arr[j + 1] = arr[j];
            j--;
        }
        // 当已排序的数 没有比它大了的时候就把它插入到当前位置；
        arr[j + 1] = nowValue;
    }
    mark1('插入排序结束');
}

function insertionSort2() {
    let arr = makeArr(l);
    let mark1 = markTime('插入两份排序开始');
    for (let i = 1; i < arr.length; i++) {
        let nowValue = arr[i];
        let left = 0;
        let right = i - 1;
        while (left <= right) {
            let middle = parseInt(((left + right) / 2) as any);
            if (nowValue > arr[middle]) {
                left = middle + 1;
            } else {
                right = middle - 1;
            }
        }
        //console.log(`${i} 当前值 ${nowValue} 找到的位置left ${left} `);
        //console.log(JSON.stringify(arr));
        for (let j = i - 1; j >= left; j--) {
            arr[j + 1] = arr[j];
        }
        arr[left] = nowValue;
    }
    //console.log(arr);
    mark1('插入两份排序结束');
}

function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    let middle = Math.floor(arr.length / 2);
    let middleValue = arr[middle];
    let left = [];
    let right = [];
    for (let i = 0; i < arr.length; i++) {
        if (i !== middle) {
            if (arr[i] < middleValue) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }
    }
    return [...quickSort(left), middleValue, ...quickSort(right)];
}

function main() {
    //bubble();
    insertionSort();
    insertionSort2();
    let mark1 = markTime('快速排序开始');
    quickSort(makeArr(l));
    mark1('快速排序借宿');
}

main();
