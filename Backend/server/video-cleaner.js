const findRemoveSync = require('find-remove')

setInterval(() => {
    var result = findRemoveSync('./cam1-videos', { age: { seconds: 30 }, extensions: '.ts' });
    console.log(result);
}, 5000);