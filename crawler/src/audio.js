const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function downloadFile(url, downloadDir) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        const urlParts = url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const dirName = fileName.slice(0, 2); // 取前两位作为目录名

        const dirPath = path.join(downloadDir, dirName);
        const filePath = path.join(dirPath, fileName);

        // 创建目录（如果不存在）
        fs.mkdirSync(dirPath, { recursive: true });

        // 创建写入流
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

    } catch (error) {
        console.error(`Error downloading ${url}:`, error.message);
    }
}

async function downloadFiles(urls, downloadDir, batchSize = 5) {
    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        await Promise.all(batch.map(url => downloadFile(url, downloadDir)));
        console.log(`Downloading ${i + batchSize}/${urls.length}`);
    }
}

const books = JSON.parse(fs.readFileSync(__dirname + '/../data/books-raw.json', 'utf8'));
// 示例链接数组
const urls = books.map(book => book.pages.map(page => page.audio).filter(a => a)).flat();

// console.log(urls);

// 指定下载目录
const downloadDir = path.join(__dirname, '/../data/audios');

// 设置每批次下载数量
downloadFiles(urls, downloadDir, 5)
    .then(() => console.log('All files downloaded'))
    .catch(err => console.error('Error downloading files:', err));
