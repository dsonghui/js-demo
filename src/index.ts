async function fetchData(url) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve(url);
        }, 4000)
    })
}

function run() {
    let a = fetchData('url');
    console.log(a);
}

run();
