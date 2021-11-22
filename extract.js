const inly = require('inly');

exports.file = function file(from, to) {
    const extract = inly(from, to);

    extract.on('file', (name) => {
        console.log(name);
    });

    extract.on('progress', (percent) => {
        console.log(percent + '%');
    });

    return new Promise((resolve, reject) => {
        extract.on('error', (error) => {
            console.error(error);
            reject(error);
        });

        extract.on('end', () => {
            console.log('done');
            resolve();
        });
    })
    
}
