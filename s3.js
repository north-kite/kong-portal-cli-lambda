const AWS = require('aws-sdk');
const fs = require('fs');

const s3Client = new AWS.S3()

exports.download = async function download(filePath, bucketName, key) {
    const params = {
        Bucket: bucketName,
        Key: key
    };

    try {
        console.log('attempting to download ' + bucketName + '/' + key + ' to ' + filePath);
        const { Body } = await s3Client.getObject(params).promise()
        fs.writeFileSync(filePath, Body);
        console.log(`${filePath} has been created!`);
    } catch (error) {
        console.error(error)
    }
};
