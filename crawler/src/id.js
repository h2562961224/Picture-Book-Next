const fs = require('fs');
const {chromium} = require('playwright');

//获取当前目录路径
const currentDir = __dirname;
async function fetchSchools() {

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.route('**/*', route => {
    // 检查请求资源类型
    const resourceType = route.request().resourceType();

    // 如果资源类型不是 'document'（即 HTML），则阻止请求
    if (resourceType !== 'document'
      // && resourceType !== 'xhr'
      // && resourceType !== 'fetch'
      // && resourceType !== 'script'
    ) {
      route.abort();
    } else {
      if (route.request().url().includes('limaogushi.com')) {
        route.continue();
      } else {
        route.abort();
      }
    }
  });


  const cats = {
    "shehuishenghuo": 28,
    "yizhiyouxi": 1,
    "renzhi": 6,
    "ziran": 6,
    "minjiangushi": 2,
    "tonghua": 32,
    "xinli": 1,
    "qinggan": 1,
    "qingxu": 1,
    "jiankang": 1,
    "yishu": 2,
    "duoyuanwenhua": 2,
    "kepu": 4,
    "renwu": 1,
    "jingdianhuiben": 4,
    "lishi": 1,
    "huojiang": 1,
    "zhexue": 1,
    "wenxue": 1,
    "yuyan": 2,
    "shenghuogushi": 1,
    "renwuzhuanji": 1,
    "yuyangushi": 1,
    "ziworenzhi": 1,
    "youqing": 1,
    "yingyu": 1
  };

  const idPath = currentDir + '/../data/ids.json';
  fs.appendFileSync(idPath, '[', 'utf8');
  const catUrls = Object.keys(cats).map(k => {
    const urls = [];
    for (let i = 1; i <= cats[k]; i++) {
      urls.push(`https://www.limaogushi.com/huiben/${k}/page/${i}`);
    }
    return urls;
  }).flat();
  console.log(catUrls);

  for (let i = 0; i < catUrls.length; i++) {
    await page.goto(catUrls[i]);
    const ids = await page.evaluate(() => {
      const ids = [];
      const lis = document.querySelectorAll('.art_label ul li');
      lis.forEach(li => {
        const a = li.querySelector('a');
        if (a) {
          const href = a.href;
          const id = href.split('/').pop();

          ids.push(id.split('.')[0]);
        }
      });
      return ids;
    });
    if (i === catUrls.length - 1) {
      fs.appendFileSync(idPath, ids.join(','), 'utf8');
    } else {
      fs.appendFileSync(idPath, ids.join(',') + ',', 'utf8');
    }
  }


  fs.appendFileSync(idPath, ']', 'utf8');



  await browser.close();
}

async function main() {

  try {
    await fetchSchools();
  } catch (err) {
    console.error('Error reading file:', err);
  }
}

main();