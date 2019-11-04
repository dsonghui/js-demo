export function makeArr(l = 100) {
    return Array(l).fill(0).map((index) => {
        return Math.round(Math.random() * l * 10);
    });
}

export function markTime(title?, t?) {
    t = t || Date.now();
    return function(title2?) {
        let cha = (Date.now() - t) / 1000;
        console.log(`${title2} - ${title} 时间差：${cha}`);
    };
}
