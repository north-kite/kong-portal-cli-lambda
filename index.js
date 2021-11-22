const util = require('util');
const exec = util.promisify(require('child_process').exec);
const ssm = require('./ssm')
const s3 = require('./s3')
const extract = require('./extract')
const fsPromises = require("fs").promises;

const bucketName = process.env.BUCKET_NAME;
const filePath = process.env.FILE_PATH;
const ssmPath = process.env.KONG_ADMIN_TOKEN_NAME;
const taskDir = process.env.LAMBDA_TASK_ROOT

exports.handler = async function handler({ workspace, key }) {
    try {
        const token = await ssm.getParameter(ssmPath);

        await s3.download(`/tmp/${workspace}.tar.gz`, bucketName, filePath + key);

        await extract.file(`/tmp/${workspace}.tar.gz`, '/tmp/');

        await fsPromises.writeFile(`/tmp/workspaces/${workspace}/cli.conf.yaml`, `kong_admin_token: '${token}'`);
        console.log(`Token written to: /tmp/workspaces/${workspace}/cli.conf.yaml`)

        const { stdout: version } = await exec(taskDir + '/node_modules/kong-portal-cli/bin/src/portal.js --version');
        const { stdout: enable } = await exec(taskDir + './node_modules/kong-portal-cli/bin/src/portal.js deploy -D ' + workspace);

        return {
            statusCode: 200,
            body: {
                version,
                enable,
            },
        };
    } catch (error) {
        console.error('ERROR:');
        console.error(error);
        throw error;
    }
};
