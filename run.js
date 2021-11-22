const fsPromises = require('fs').promises;
const {handler} = require('./index')

async function run() {
    try {
        const data = await fsPromises.readFile('resources/event.json', 'utf8');
        const result = await handler(JSON.parse(data));
        console.log(result);
    } catch (error) {
        console.log(error);
    }
}
run()
