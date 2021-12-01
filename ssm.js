const AWS = require('aws-sdk');

const ssmClient = new AWS.SSM({region: 'eu-west-2'})

exports.getParameter = async function getParameter(name) {
    const params = {
        Name: name,
        WithDecryption: true
    }

    try {
        const data = await ssmClient.getParameter(params).promise();
        console.log('SSM parameter retrieved');
        return data.Parameter.Value;
    } catch (error) {
        console.log(error, error.stack)
        return null;
    }
}
