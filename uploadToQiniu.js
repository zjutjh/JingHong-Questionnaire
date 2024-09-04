import qiniu from 'qiniu';
import path from 'path';
import fs from 'fs';

// 七牛云的 Access Key 和 Secret Key
const accessKey = 'eLmAKSMd1xAsFxU-UjMGxU094R7jPThWGaCiLi0W';
const secretKey = '7zRSD0y_Lpi_ujucN0FCmPWhJLwNvaOk4TmsWW_t';
const bucket = 'lonesome';  // 存储空间名
const baseDir = path.resolve('dist');  // Vue 3 构建后的文件目录
const uploadPathPrefix = 'project/JH-Questionnaire/';  // 上传到七牛云的路径前缀

// 生成上传凭证
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const options = {
    scope: bucket,
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

// 配置上传机房区域
const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;  // 华东区域

const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();

function uploadFile(localFile, key) {
    return new Promise((resolve, reject) => {
        // 设置 force 为 true 以覆盖同名文件
        const options = {
            scope: bucket + ':' + key, // 指定要覆盖的文件路径
            force: true
        };
        const putPolicy = new qiniu.rs.PutPolicy(options);
        const uploadToken = putPolicy.uploadToken(mac);

        formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr, respBody, respInfo) {
            if (respErr) {
                reject(respErr);
            } else {
                if (respInfo.statusCode === 200) {
                    resolve(respBody);
                } else {
                    reject(respInfo);
                }
            }
        });
    });
}


// 遍历 dist 目录并上传所有文件
async function uploadDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
            const key = uploadPathPrefix + path.relative(baseDir, fullPath).replace(/\\/g, '/');
            try {
                const result = await uploadFile(fullPath, key);
                console.log(`Uploaded ${key}:`, result);
            } catch (err) {
                console.error(`Failed to upload ${key}:`, err);
            }
        } else if (stat.isDirectory()) {
            await uploadDirectory(fullPath);
        }
    }
}

// 执行上传
uploadDirectory(baseDir).then(() => {
    console.log('All files uploaded successfully');
}).catch(err => {
    console.error('Error uploading files:', err);
});
