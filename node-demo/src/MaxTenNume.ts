/**
 * 如何从10000个数中找到最大的10个数
 */

import { makeArr, markTime } from "./helper";

function main() {
    let Arr = makeArr(10000);
    let targetArr = [];

    //console.log(JSON.stringify(Arr));

    function insertSort(arr, val) {
        //console.log(`开始排序 数组为${JSON.stringify(arr)} 排序值为${val}`);
        let i = arr.length - 1;
        while (i >= 0 && val > arr[i]) {
            //往后移一位
            arr[i + 1] = arr[i];
            i--;
            //console.log(JSON.stringify(arr));
        }
        arr[i + 1] = val;
        //console.log(JSON.stringify(arr));
        //console.log('========');
    }

    Arr.forEach(item => {
        if (targetArr.length < 10) {
            insertSort(targetArr, item);
        }else  if ( item > targetArr[targetArr.length - 1]) {
            insertSort(targetArr, item);
            targetArr = targetArr.slice(0,10);
        }
    });

    console.log(targetArr);

}

main();
